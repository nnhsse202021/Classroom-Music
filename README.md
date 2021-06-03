# Classroom-Music
The Classroom Music web server allows a teacher to play a playlist of songs as chosen by their students. It has three different views: the sign-in, teacher, and student views. Each one serves a different function in playing music in the classroom.

## Usage:
If you're simply interested in using or visiting the website, then you can visit https://classroom-music-public.thedoge.repl.co. The website will work on any modern web browser (Chrome/Firefox/Microsoft Edge) and should work on all major operating systems (Windows/MacOS/Linux). 

## Development
If you want to run the server on your computer locally, here are the steps. Note: this has been tested on Mac OS X+ and Windows 10, but it should work on most operating systems.
### Installation:
1. Pull the code from Github.
2. Install node.js and npm. You can download it here: https://www.npmjs.com/get-npm.
3. In the VScode terminal, enter the command `npm install`. This will install all the packages you need.
### Running the Program:
1. In the VScode terminal, run the `index.js` file (by using the command `node index.js`).
2. Open your favorite browser and go to the url `localhost:3000`. This will pull up a local version of the website. **Many features will not work on this version**, since the music server requires repl.it integration for databases. 
3. To stop running the server, press ctrl+C (not command+C if you’re on mac!).

## Sign-In
The sign-in is simple -- its singular purpose is to guide students and teachers to their respective views.

## Student View
The student view is a bit more complex. Just in case, the student gets a sign out button that brings them back to the sign-in page. 

### Joining a Classroom
Upon entering student view, the top of the student's page requires them to input the code they got from their teacher. Once they've done so, they can see whichever class code they're currently adding songs to, and then can begin submitting songs.

### Submitting songs
The student can also submit songs. The student begins by searching for a song. It finds this song on YouTube, after which the student can add it to the playlist in the teacher view. After searching for a song and locating it, the student is told to verify that the song is clean.

## Teacher View
The teacher view has the most detail. Not only does it have all the elements of the student view, but also allows for control over the playlist itself, as well as the creation and control of classes.

### Playlist Controls
The teacher can play the songs in the playlist in their given order, skip them if they find them to be inappropriate or too long, and can summon a list of all the songs within the playlist. Clicking on one of those songs reveals more info, specifically the song's name and which student submitted it.

In the situation that the teacher needs to erase the playlist,they can click the clear playlist button, which will reset the playlist entirely. And in case the teacher wants to mix it up, they have a shuffle feature, which plays the songs in the playlist in a random order, but keeps them in the order they're in right now. Finally, a teacher can enable or disable the submission of songs to their playlist.

### Classroom Controls
Finally, each teachers has 8 classrooms, and each classroom has its own code. The teacher can rename the classroom. The "Disable Classroom Code" button disables the classroom code, making it so that new students are unable to join the classroom (this feature was coded but has bugs in it). Next to the disable class code button, there is a "Refresh Class List" button, and when clicked it shows a list of students in the currently selected class. Each student name on the list is clickable, and when clicked it shows more informations and options for the student: the full name, the full email, and a button allowing the teacher to remove that student from the class.

# Future Updates 
For future teams working on this project, there is a list of features and enhancements to add to the webapp on our github issues page: https://github.com/nnhsse202021/Classroom-Music/issues