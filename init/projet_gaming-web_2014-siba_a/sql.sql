-- phpMyAdmin SQL Dump
-- version 3.5.7
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Mer 06 Novembre 2013 à 22:42
-- Version du serveur: 5.5.29
-- Version de PHP: 5.4.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données: `snake`
--
CREATE DATABASE `snake` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `snake`;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `score` int(11) NOT NULL,
  `coins` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Contenu de la table `user`
--

INSERT INTO `user` (`id`, `login`, `password`, `score`, `coins`) VALUES
(1, 'anais', '098f6bcd4621d373cade4e832627b4f6', 6518, 1747),
(2, 'test', '098f6bcd4621d373cade4e832627b4f6', 6520, 660),
(3, 'lucas', 'dc53fc4f621c80bdc2fa0329a6123708', 6521, 1747),
(4, 'blood', '6b157916b43b09df5a22f658ccb92b64', 2282, 1747);
