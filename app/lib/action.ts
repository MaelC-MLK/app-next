'use server';

import { db } from '@/app/lib/db';
import { Intervenant } from '@/app/lib/definitions';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';  
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { addMonths, format } from 'date-fns';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';


const ITEMS_PER_PAGE = 10;
 
const AvailabilitySchema = z.object({
  days: z.string().nonempty(),
  from: z.string().nonempty(),
  to: z.string().nonempty(),
});

const UpdateAvailabilitySchema = z.record(z.string(), z.array(AvailabilitySchema));

export async function updateAvailability(intervenantId: string, availability: Record<string, { days: string; from: string; to: string }[]>) {
  const validatedAvailability = UpdateAvailabilitySchema.safeParse(availability);
  if (!validatedAvailability.success) {
    return {
      errors: validatedAvailability.error.flatten().fieldErrors,
      message: 'Invalid availability data.',
    };
  }

  try {
    const client = await db.connect();
    await client.query(`
      UPDATE public.intervenants
      SET availability = $1
      WHERE id = $2
    `, [JSON.stringify(validatedAvailability.data), intervenantId]);
    client.release();
    return { message: 'Availability updated successfully.' };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to update availability.' };
  }
}


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Email ou mot de passe incorrect !';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function regenAllKeys() {
  try {
    const client = await db.connect();
    const result = await client.query('SELECT id FROM public.intervenants');
    const intervenants = result.rows as { id: number }[];

    for (const intervenant of intervenants) {
      const newKey = uuidv4();
      const creationDate = new Date();
      const endDate = addMonths(creationDate, 2);
      await client.query(`
        UPDATE public.intervenants
        SET key = $1, creationdate = $2, enddate = $3
        WHERE id = $4
      `, [newKey, format(creationDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'), intervenant.id]);
    }
    revalidatePath('/dashboard/intervenants');
    client.release();
  } catch (err) {
    console.error('Failed to regenerate all keys:', err);
    throw err;
  }
}

export async function fetchAllInterveants(): Promise<Intervenant[]> {
  try {
    const client = await db.connect();
    const result = await client.query('SELECT * FROM public.intervenants');
    const data = result.rows as Intervenant[];
    client.release();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function fetchFilteredIntervenants(query: string, currentPage: number): Promise<Intervenant[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const client = await db.connect();
    const result = await client.query(`
      SELECT *
      FROM public.intervenants
      WHERE
        firstname ILIKE $1 OR
        lastname ILIKE $1 OR
        email ILIKE $1 OR
        key ILIKE $1
      ORDER BY creationdate DESC
      LIMIT $2 OFFSET $3
    `, [`%${query}%`, ITEMS_PER_PAGE, offset]);
    const data = result.rows as Intervenant[];
    client.release();
    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch intervenants.');
  }
}

export async function fetchIntervenantById(id: string): Promise<Intervenant> {
  try {
    const client = await db.connect();
    const result = await client.query('SELECT * FROM public.intervenants WHERE id = $1', [id]);
    const data = result.rows[0] as Intervenant;
    client.release();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function fetchIntervenantsPages(query: string): Promise<number> {
  try {
    const client = await db.connect();
    const result = await client.query(`
      SELECT COUNT(*)
      FROM public.intervenants
      WHERE
        firstname ILIKE $1 OR
        lastname ILIKE $1 OR
        email ILIKE $1 OR
        key ILIKE $1
    `, [`%${query}%`]);
    client.release();
    const totalPages = Math.ceil(Number(result.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch total number of intervenants.');
  }
}

export async function deleteInterveant(id: number): Promise<void> {
  try {
    const client = await db.connect();
    await client.query('DELETE FROM public.intervenants WHERE id = $1', [id]);
    revalidatePath('/dashboard/intervenants');
    client.release();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function regenKey(id: number): Promise<void> {
  try {
    const client = await db.connect();
    const newKey = uuidv4();
    const creationDate = new Date();
    const endDate = addMonths(creationDate, 2);
    await client.query(`
      UPDATE public.intervenants
      SET key = $1, creationdate = $2, enddate = $3
      WHERE id = $4
    `, [newKey, format(creationDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'), id]);
    revalidatePath('/dashboard/intervenants');
    client.release();
  } catch (err) {
    console.error('Failed to regenerate key:', err);
    throw err;
  }
}

export type State = {
  errors?: {
    firstname?: string[];
    lastname?: string[];
    email?: string[];
    key?: string[];
    creationdate?: string[];
    enddate?: string[];
  };
  message?: string | null;
};

const CreateIntervenantSchema = z.object({
  firstname: z.string().nonempty({ message: 'First name is required' }),
  lastname: z.string().nonempty({ message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  key: z.string().nonempty({ message: 'Key is required' }),
  creationdate: z.string().nonempty({ message: 'Creation date is required' }),
  enddate: z.string().nonempty({ message: 'End date is required' }),
});

interface PostgresError extends Error {
  code: string;
  constraint: string;
}

export async function createIntervenant(prevState: State, formData: FormData) {
  const validatedFields = CreateIntervenantSchema.safeParse({
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    email: formData.get('email'),
    key: formData.get('key'),
    creationdate: formData.get('creationdate'),
    enddate: formData.get('enddate'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Intervenant.',
    };
  }

  const { firstname, lastname, email, key, creationdate, enddate } = validatedFields.data;
  try {
    const client = await db.connect();
    await client.query(`
      INSERT INTO public.intervenants (firstname, lastname, email, key, creationdate, enddate)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [firstname, lastname, email, key, creationdate, enddate]);
    client.release();
  } catch (error) {
    console.error('Database Error:', error);
    const dbError = error as PostgresError;
    if (dbError.code === '23505' && dbError.constraint === 'unique_email') {
      return {
        errors: { email: ['Email already exists'] },
      };
    }
    return {
      message: 'Database Error: Failed to Create Intervenant.',
    };
  }

  revalidatePath('/dashboard/intervenants');
  redirect('/dashboard/intervenants');
}

export async function updateIntervenant(prevState: UpdateState, formData: FormData, id: string) {
  const validatedFields = UpdateIntervenantSchema.safeParse({
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    email: formData.get('email'),
    enddate: formData.get('enddate'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Intervenant.',
    };
  }

  const { firstname, lastname, email, enddate } = validatedFields.data;
  try {
    const client = await db.connect();
    await client.query(`
      UPDATE public.intervenants
      SET firstname = $1, lastname = $2, email = $3, enddate = $4
      WHERE id = $5
    `, [firstname, lastname, email, enddate, id]);
    client.release();
  } catch (error) {
    console.error('Database Error:', error);
    const dbError = error as PostgresError;
    if (dbError.code === '23505' && dbError.constraint === 'unique_email') {
      return {
        errors: { email: ['Email already exists'] },
      };
    }
    return {
      message: 'Database Error: Failed to Update Intervenant.',
    };
  }

  revalidatePath('/dashboard/intervenants');
  redirect('/dashboard/intervenants');
}

const UpdateIntervenantSchema = z.object({
  firstname: z.string().nonempty({ message: 'First name is required' }),
  lastname: z.string().nonempty({ message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  enddate: z.string().nonempty({ message: 'End date is required' }),
});

export type UpdateState = {
  errors?: {
    firstname?: string[];
    lastname?: string[];
    email?: string[];
    enddate?: string[];
  };
  message?: string | null;
};


export async function fetchIntervenantByKey(key: string): Promise<Intervenant | null> {
  try {
    const client = await db.connect();
    const result = await client.query('SELECT * FROM public.intervenants WHERE key = $1', [key]);
    client.release();
    return result.rows[0] as Intervenant;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch intervenant by key.');
  }
}
