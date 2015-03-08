# Phase 2: Viewing Regions and Birds, User Profile

## Rails
### Models

### Controllers
StaticPagesController (public, private)
Api::RegionsController (create, destroy, index, show)
Api::BirdsController (create, destroy, index, quiz_question)
(quiz_question route responds with 4 random birds from a region)

### Views
* layouts/_header.html.erb (header partial on all pages)
* regions/index.json.jbuilder (JSON for a user's region)
* regions/show.json.jbuilder (JSON for a user's region and its birds)

## Backbone
### Models
* Region (parses associated Birds collection)
* Bird

### Collections
* Regions
* Birds

### Views
StaticPages#private---
* RegionForm
* RegionShow (composite view, contains PostsIndex subview)
* RegionIndex (composite view, contains RegionIndexItem subviews)
* UserForm

StaticPages#public
* Welcome
* SessionForm

## Gems/Libraries
