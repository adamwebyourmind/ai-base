-- Create addresses table first 
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    postal_code VARCHAR(20),
    country VARCHAR(255)
);

-- Create users table, including team_id with REFERENCES to teams(id)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password TEXT,
    email_verified TIMESTAMPTZ,
    image TEXT,
    address_id INTEGER REFERENCES addresses(id),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user',
    is_subscribed BOOLEAN DEFAULT FALSE,
    subscription_id VARCHAR(255),
    subscription_status VARCHAR(50),
    stripe_customer_id VARCHAR(255),
    subscription_credits INTEGER DEFAULT 0,
    additional_credits INTEGER DEFAULT 0;
);

-- Create the rest of the tables as before
CREATE TABLE verification_tokens (
    identifier TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    token TEXT NOT NULL PRIMARY KEY
);

CREATE TABLE password_reset_tokens (
    user_id INTEGER REFERENCES users(id) NOT NULL,
    token TEXT NOT NULL PRIMARY KEY,
    expires TIMESTAMPTZ NOT NULL
);

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'user' or 'assistant'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE readings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    tarot_session_id INTEGER REFERENCES tarot_sessions(id)
    user_query TEXT,
    spread_type VARCHAR(255),
    ai_interpretation TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE cards_in_readings (
    id SERIAL PRIMARY KEY,
    reading_id INTEGER REFERENCES readings(id) ON DELETE SET NULL,
    card_name VARCHAR(255),
    orientation VARCHAR(50),
    position INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD COLUMN is_subscribed BOOLEAN DEFAULT FALSE,
ADD COLUMN subscription_id VARCHAR(255),
ADD COLUMN subscription_status VARCHAR(50),
ADD COLUMN stripe_customer_id VARCHAR(255),
ADD COLUMN subscription_credits INTEGER DEFAULT 0,
ADD COLUMN additional_credits INTEGER DEFAULT 0;

ALTER TABLE users
ADD COLUMN free_readings INTEGER DEFAULT 1;

CREATE TABLE subscription_events (
    event_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50),
    stripe_event_id VARCHAR(255),
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE credit_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    credits INTEGER,
    event_type VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE tarot_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER REFERENCES users(id),
);

ALTER TABLE readings
ADD COLUMN tarot_session_id UUID REFERENCES tarot_sessions(id);

DO $$
DECLARE
    reading RECORD;
BEGIN
    FOR reading IN SELECT * FROM readings LOOP
        INSERT INTO tarot_sessions (user_id, created_at)
        VALUES (reading.user_id, reading.created_at)
        RETURNING id INTO reading.tarot_session_id;

        UPDATE readings
        SET tarot_session_id = reading.tarot_session_id
        WHERE id = reading.id;
    END LOOP;
END $$;

