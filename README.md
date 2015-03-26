# Chickadee

[www.chickadee.io][live]

[live]: http//www.chickadee.io

## About
Chickadee is a quiz application for learning to identify birds by their songs, modeled loosely after Duolingo. Users customize their study regions to practice the bird species relevant to them. Chickadee uses bird demographic data collected by birdwatchers and scientists through Cornell Laboratory of Ornithology's [eBird][ebird] database, and bird audio recordings from the [Xeno-canto Foundation][xeno-canto]'s archives. Chickadee is built with Backbone.js and Ruby on Rails.

[ebird]: http://www.ebird.org
[xeno-canto]: http://www.xeno-canto.org

## Features
- users can study bird songs from any country in the world, or a given state/province or county in many countries
- users have a customizable profile
- quizzes are saved where you left them to resume later
- streak count encourages you to keep practicing
- users can log in with Facebook
- links to a bird song's audio data for more information

## Under the hood
- responsive design/UI with CSS and jQuery
- client-side Backbone.js consuming RESTful Rails API
- store bird audio & profile images with Amazon Web Services
- PostgreSQL database queries APIs for file links and downloads audio when not yet available through AWS S3

### Next steps
- [X] Loading spinners/quiz answer flash to decrease perceived load time
- [ ] Simplistic instructions on sign up walk user through setting up first quiz
- [ ] Full autocomplete on regions form matching to database
- [ ] Enhance basic gamification (add lives, XP)
- [ ] Integrate bird photographs to better ground the app in reality

