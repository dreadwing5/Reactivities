# Entity Framework Relationships

## Overview

This chapter covers Entity Framework Core relationships, focusing on how tables in our database relate to each other, particularly in the context of users attending activities.

## Learning Goals

1. Understand and implement Entity Framework Relationships
2. Learn techniques for loading related entities
3. Utilize AutoMapper queryable extensions
4. Add and integrate an Infrastructure project

## Topics

- [Entity Framework Relationships](#entity-framework-relationships)
  - [Overview](#overview)
  - [Learning Goals](#learning-goals)
  - [Topics](#topics)
    - [One-to-Many Relationships](#one-to-many-relationships)
      - [Implementation](#implementation)
    - [Many-to-Many Relationships](#many-to-many-relationships)
      - [Implementation](#implementation-1)
    - [One-to-One Relationships](#one-to-one-relationships)
      - [Implementation](#implementation-2)
    - [Configuring Relationships](#configuring-relationships)
  - [Adding an Infrastructure Project](#adding-an-infrastructure-project)
    - [User Accessor](#user-accessor)
  - [Q\&A](#qa)

### One-to-Many Relationships

One-to-many relationships in Entity Framework occur when one entity can have multiple related entities. For example, a user can have many photos.

#### Implementation

Entity Framework is good at configuring one-to-many relationships by convention. For example, adding a collection of photos to a user entity would automatically set up the necessary foreign key relationship.

### Many-to-Many Relationships

Many-to-many relationships occur when multiple entities can be related to multiple entities of another type. In this context, users can attend many activities, and activities can have many attendees (users).

#### Implementation

While Entity Framework can now configure many-to-many relationships by convention, this section focuses on creating a custom join table for additional flexibility. This allows tracking extra information like the date a user joined an activity or whether a user is the host.

### One-to-One Relationships

One-to-one relationships occur when one entity is related to exactly one instance of another entity. An example mentioned is a user having one address.

#### Implementation

Entity Framework can handle one-to-one relationships by convention, similar to one-to-many relationships.

### Configuring Relationships

The transcript doesn't provide specific details on configuring relationships, but it mentions that Entity Framework can work out relationships by convention in many cases.

## Adding an Infrastructure Project

An Infrastructure project is introduced to maintain clean architecture principles:

1. It has a dependency on the application layer but not vice versa.
2. It allows the application layer to remain independent of authentication concerns.
3. It implements interfaces defined in the application layer.

### User Accessor

A key component of the Infrastructure project is the User Accessor:

1. An interface for getting a user's username is defined in the application layer.
2. The implementation is in the infrastructure project.
3. It accesses the HttpContext to retrieve the username from the token.

This approach ensures that the application layer remains agnostic to authentication methods, adhering to clean architecture principles. If the authentication method changes (e.g., from API to console), only the implementation in the infrastructure layer would need to change, leaving the application logic untouched.

## Q&A

The transcript doesn't provide specific Q&A content, so this section would need to be filled with relevant questions and answers based on the topics covered.
