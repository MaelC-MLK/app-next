## Initialisation du projet

-- npm install

-- docker-compose up --d

-- Accéder au localhost:5050
Identifiant : admin@gmail.com / drowssap

-- cliquer sur add new serveur ![image](https://github.com/user-attachments/assets/c05b0edc-908b-4089-9afb-7aae9a5ccd7c)

-- Dans general : Name = PostgreSQL
-- Connection : 
Hostname/address = db
Username = user
Password = drowssap
-- Save

-- Aller dans le nouveau serveur

-- Login/Group Roles

-- Create 

-- Dans general : Name = user_wtperm
-- Dans definition : Password = drowssap
-- Privileges : Cocher Can login
-- Save

-- Aller sur la database -> clique droit -> Query Tool
-- Rentrer les commandes suivantes à la suite

CREATE TABLE Intervenants (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    key VARCHAR(255) NOT NULL,
    creationdate DATE NOT NULL,
    enddate DATE NOT NULL,
    availability TEXT
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO public.users (email, password) VALUES ('admin@gmail.com', '$2b$10$qBhuwwFl2QJ9qTofMY7W1Ov3762gfbEfQliLvqiLfFE7Krh0wCaMy')

Ceci sont les identifiants de connexion au dashboard : admin@gmail.com / azertyuiop

INSERT INTO public.intervenants (email, firstname, lastname, key, creationdate, enddate, availability) VALUES ('intervenant@gmail.com', 'Jean-Louis', 'LeBoss', 'f1e12e70-7818-49b9-acea-fb93abf802e4', '2024-12-10', '2025-02-10', '{"default":[{"days":"lundi","from":"8:00","to":"18:30"},{"days":"mardi","from":"8:00","to":"18:30"},{"days":"mercredi","from":"8:00","to":"18:30"},{"days":"jeudi","from":"8:00","to":"18:30"},{"days":"vendredi","from":"8:00","to":"18:30"}],"S49":[{"days":"lundi","from":"8:00","to":"18:30"},{"days":"mardi","from":"8:00","to":"18:30"},{"days":"mercredi","from":"8:00","to":"18:30"},{"days":"jeudi","from":"8:00","to":"18:30"},{"days":"vendredi","from":"8:00","to":"18:30"}],"S1":[{"days":"vendredi","from":"11:30","to":"13:30"},{"days":"vendredi","from":"14:00","to":"15:00"}],"S8":[{"days":"mardi","from":"07:30","to":"12:30"}],"S50":[{"days":"mardi","from":"07:30","to":"10:00"},{"days":"jeudi","from":"00:00","to":"00:00"},{"days":"vendredi","from":"00:00","to":"00:00"},{"days":"mercredi","from":"00:00","to":"00:00"},{"days":"mercredi","from":"00:00","to":"00:00"}],"S51":[{"days":"lundi","from":"08:30","to":"14:00"},{"days":"mardi","from":"07:30","to":"13:00"},{"days":"mercredi","from":"08:30","to":"14:00"},{"days":"jeudi","from":"05:30","to":"11:00"},{"days":"jeudi","from":"09:30","to":"15:00"}]}')

Dernière étape : 

-- Cliquer droit sur la base projet -> Grant Wizard

-- Si il n'y a rien il faut actualiser la page sinon sélectionner les deux séquences et les tables 

-- Next puis appuyer sur le petit plus en haut à droite

-- Dans grantee sélectionner user_wtperm et dans privilèges mettre all si c'est pour juste tester l'application sinon sélectionner à la convenance -> Finish


