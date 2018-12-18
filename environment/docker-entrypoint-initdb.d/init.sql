CREATE USER 'poc_dev'@'%' IDENTIFIED BY 'b1vidh';

GRANT ALL ON data.* TO 'poc_dev'@'%';

# Create a database
CREATE DATABASE IF NOT EXISTS poc_dev