# Chickadee

[Heroku link][heroku]

[heroku]: https://agile-garden-1772.herokuapp.com/

## Minimum Viable Product
Chickadee is a clone of the language-learning app Duolingo, used for learning to identify birds by song. It's built on Rails and Backbone.  With Chickadee, users can:
- [ ] Sign up, log in, and log out
- [ ] Edit user profile
- [ ] Create birds
- [ ] Create regions
- [ ] View birds
- [ ] View regions
- [ ] Take a quiz on a region's birdsongs (text description)
- [ ] See their score on a quiz
- [ ] Listen to the bird song for a given quiz question
- [ ] Upload a profile image

## Design Docs
* Wireframes were done with ink and paper!
* [DB schema][schema]

[schema]: ./docs/schema.md

## Implementation Timeline

### Phase 1: User Authentication, Birds and Regions (~1-2 days)
I will implement user authentication and the birds and regions resources with rails. Region creation will cause creation of bird models via queries to the eBird API, which will be written into the region's model logic. Nokogiri will allow me to parse the XML from querying eBird. By the end of this phase I will have simple static pages for users, sessions, regions, and birds paralleling those needed in the completed MVP.

[Details][phase-one]

### Phase 2: Viewing Regions and Birds, User Profile (~1 days)
I will add API routes to serve JSON data for a users' regions and birds, and build the Backbone front end for these resources. I plan on two static pages, one for all accessible logged-out views (just welcome page and login for the MVP) and one for logged-in views.

[Details][phase-two]

### Phase 3: Quizzes (~2 days)
I will add the quiz and question resources in Rails to be served and managed as JSON through the API, and corresponding models, collections and views in Backbone. The quiz will be presented through a series of Question/Answer Show views, flashing a QuestionResult View after each answer and a QuizResult View at the end.

[Details][phase-three]

### Phase 4: MP3 Audio (~2-3 days)
I will query the xeno-canto API to get a link for mp3 audio of a species' song; in the frequent case of multiple songs I will have one selected at random. When creating a new quiz, an mp3 link should be retrieved for each question's bird. When that question is presented, a simple player (play button only) will be visible in the QuestionShow view and play the audio from xeno-canto's servers. Ideally the audio for upcoming questions in the quiz could be queued up and ready by the time that user reaches that question. I would love to talk potential logistics over with a TA!

[Details][phase-four]

### Phase 5: Profile Image Upload (~1 days)
To allow users to upload and display a profile image like Duolingo, I'll use Paperclip and an AWS S3 Bucket to provide this functionality from the user profile page. I'll install the gems, configure heroku to work with the AWS resources, and finally display the user's image in the header when logged in.

[Details][phase-five]

### Bonus Features (TBD)
- [ ] Draggable, droppable regions on regions index/landing page
- [ ] Modal view login/signup
- [ ] Typeahead entry on new region form
- [ ] Gamification (3 "lives" during quiz, gain XP)
- [ ] Bird images shown with audio in quiz and on answer hover

[phase-one]: ./docs/phases/phase1.md
[phase-two]: ./docs/phases/phase2.md
[phase-three]: ./docs/phases/phase3.md
[phase-four]: ./docs/phases/phase4.md
[phase-five]: ./docs/phases/phase5.md
