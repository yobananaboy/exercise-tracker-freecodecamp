Matt's exercise tracker
=======================

A simple exercise tracker that allows you to add and track exercises.

You can:

Create a new user
-----------------

By completing the new user form and allocating a username

Add an exercise to an existing user
-----------------------------------

By completing the add exercise form and assigning an exercise to the corresponding *userId* on the database.

You need to add a **description** and **duration (in mins)** for this activity. You can also provide an optional **date** (otherwise it default's to today's date).

Get users's exercise log
----------------------

You can also get a user's exercise log using HTTP GET:

`GET /api/exercise/log?{userId=<userId>}[&from=<from>][&to=<to>][&limit=<limit>]`

where

**{ }** = required, **[ ]** = optional

**from**, **to** = dates (yyyy-mm-dd); **limit** = number


