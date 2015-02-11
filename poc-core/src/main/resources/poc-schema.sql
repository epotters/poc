-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Machine: localhost
-- Genereertijd: 16 dec 2014 om 10:30
-- Serverversie: 5.6.12-log
-- PHP-versie: 5.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Databank: `poc`
--
CREATE DATABASE IF NOT EXISTS `poc`
  DEFAULT CHARACTER SET utf8
  COLLATE utf8_general_ci;
USE `poc`;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `person`
--

CREATE TABLE IF NOT EXISTS `person` (
  `id`         INT(11)     NOT NULL,
  `firstName`  VARCHAR(60) NOT NULL,
  `prefix`     VARCHAR(20) NOT NULL,
  `lastName`   VARCHAR(60) NOT NULL,
  `gender`     TEXT        NOT NULL,
  `birthDate`  DATE        NOT NULL,
  `birthPlace` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`id`)
)
  ENGINE =InnoDB
  DEFAULT CHARSET =utf8;

/*!40101 SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION */;
