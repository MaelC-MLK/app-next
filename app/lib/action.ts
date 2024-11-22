import {db} from '@/app/lib/db';
import { Intervenant } from '@/app/lib/definitions';

export default async function fetchAllInterveants(): Promise<Intervenant[]> {
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
