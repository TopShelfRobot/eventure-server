CREATE ROLE eventure with LOGIN SUPERUSER NOCREATEDB PASSWORD '12345678';
-- CREATE ROLE event_writer with LOGIN NOCREATEDB PASSWORD 'event_writer_pass';

CREATE DATABASE eventure WITH OWNER eventure;

-- GRANT INSERT,SELECT ON ALL TABLES IN SCHEMA public TO event_writer;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO event_writer;
