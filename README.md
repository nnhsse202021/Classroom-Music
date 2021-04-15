# Classroom-Music
The Classroom Music web server is made to allow a teacher to play a playlist of songs as chosen by their students. As it is right now, has three different views: the sign-in, teacher, and student views. Each one serves a different function in playing music in the classroom.

## Usage:
If you're simply interested in visiting the website, then you can visit https://classroom-music.thedoge.repl.co/.

## Development
If you want to run the server on your computer locally, here are the steps:
### Installation:
1. Pull the code from Github.
2. Install node.js and npm. You can download it here: https://www.npmjs.com/get-npm.
3. In the VScode terminal, enter the command `npm install`. This will install all the packages you need.
### Running the Program:
1. In the VScode terminal, run the command `node index.js`.
2. Open a new tab in your favorite browser and go to the url `localhost:3000`. (Note: VScode provides the option to open a new window in the bottom-left. I recommend **not** using this option.)
3. To stop running the server, press ctrl+C (not command+C if you’re on mac!).

## Sign-In
The sign-in is simple -- its singular purpose is to guide students and teachers to their respective views.

## Student View
The student view is a bit more complex. Just in case, the student gets a sign out button that brings them back to the sign-in page. More importantly, the student can submit songs. First, they input a code, which they get from their teacher, and then search for a song. It finds this song on YouTube, after which the student can add it to the playlist in the teacher view. After searching for a song and locating it, the student is told to verify that the song is clean.

## Teacher View
The teacher view has the most detail. Not only does it have all the elements of the student view, but also allows for control over the playlist itself. 

The teacher can play the songs in the playlist in their given order, skip them if they find them to be inappropriate or too long, and can summon a list of all the songs within the playlist. In the situation that the teacher needs to erase the playlist, such as when a new one is needed for a different set of students, they can click the clear playlist button, which will reset the playlist entirely. And in case the teacher wants to mix it up, they have a shuffle feature, which plays the songs in the playlist in a random order, but keeps them in the order they're in right now. 

Finally, teachers have their own classrooms. Although a teacher can only have on classroom as of now, they can create codes to allow students to join and submit songs.