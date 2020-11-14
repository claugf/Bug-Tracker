# Bug-Tracker
> This is a cloud web application project that help to keeping track of the bugs of a system or project. 

## Table of contents
* [General info](#general-info)
* [Screenshots](#screenshots)
* [Technologies](#technologies)
* [Setup](#setup)
* [Changelog](#changelog)
* [Roadmap](#roadmap)
* [Contact](#contact)

## General info
> Through this application the user can register a project and the bugs or issues founded in such project. Within every issue founded, the user can add follow up comments about the issue. It is also possible to add more users, all password's users are hashed for security reasons. 

## Screenshots
![Example screenshot](./img/screenshot.png)

## Technologies
* Express - version 4.17
* Body-parser - version 1.19
* MongoDB - version 3.6
* Bcrypt - version 5.0
* EJS - version 3.1

## Setup
Access the app throught the following link:
* https://pure-ocean-21134.herokuapp.com/

## Code Examples
Some examples of usage are:
### Users
* To get all users:
```
$ {GET} `/users`
```
* To get individual user:
```
$ {GET} `/users/me@cbwa.com`
```
* To add new user:
```sh
 {POST}`/users`
 {
 `"name"`: `"McGregor"`,
 `"email"`: `"McGregor@cbwa.com"`, 
 `"usertype"`: `"user"`,
 `"key"`: `"new password"`
 }
```
### Projects
* To get all projects:
{GET} `/projects`
* To get individual project:
{GET} `/projects/{SLUG}`
* To add new project:
{POST}`/projects`
{
`"slug"`: `"NEW"`,
`"name"`: `"Brand new project"`,
`"description"`: `"this is a new project"` 
}
### Issues
* To get all issues:
{GET} `/issues`
* To get individual issue:
{GET} `/issues/BOOKS-1`
* To get all issues for a project:
{GET} `/projects/BOOKS/issues`
* To update status of a issue:
{PUT} `/projects/BOOKS/issues/BOOKS-2/open`
{PUT} `/projects/BOOKS/issues/BOOKS-2/wip` 
{PUT} `/projects/BOOKS/issues/BOOKS-2/blocked` 
{PUT} `/projects/BOOKS/issues/BOOKS-2/closed`
* To add new issue:
{POST}`/projects/BOOKS/issues`
`{
"title": "Fix",
"description": "That’s the third issue", 
}`

## Changelog
* October 2020 Created project for CBWA - _finished_
* November 2020 Error handling / Readme - _finished_
* November 2020 Frontend - Loggin/Users/Projects/Issues - _in progress_
* November 2020 Watchers who want updates of the projects/issues - _in progress_
* November 2020 Email notifications - _in progress_

## Roadmap
* December 2020 Frontend Watchers
* December 2020 Unit Testing

## Contact
Created by [@claugf](mailto:claudiagf_7@hotmail.com) - feel free to contact me!
