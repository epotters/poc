-- Create a user
CREATE USER 'poc'@'%' IDENTIFIED BY 'b1vidh';

-- Create a database
CREATE DATABASE IF NOT EXISTS poc;


GRANT ALL ON poc_dev.* TO 'poc'@'%';

