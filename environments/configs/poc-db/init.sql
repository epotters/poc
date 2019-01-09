-- Create a user
CREATE USER 'poc_dev'@'%' IDENTIFIED BY 'b1vidh';

-- Create a database
CREATE DATABASE IF NOT EXISTS poc_dev;


GRANT ALL ON poc_dev.* TO 'poc_dev'@'%';

