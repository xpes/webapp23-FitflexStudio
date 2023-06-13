# FitflexStudio

## Organization Description:

FitflexStudio is a fitness centre that aims to foster healthy living, wellness, and active lifestyles. Their wide variety of fitness classes and personalized training programs cater to individuals seeking to achieve their fitness objectives while maintaining a well-balanced life. Moreover, FitflexStudio offers exceptional services that enable customers to attain their goals with ease.

## Business Activities:
Transforming lives through fitness is what we are passionate about at FitflexStudio. Our ultimate goal is to cultivate a positive and encouraging atmosphere, where everyone, regardless of their fitness level, can prosper and realize their full potential. Our well-trained and motivated team of certified trainers and staff, provide personalized guidance and support to each member.

Our activities include business operations such as:
·        Looking for ways to get fit? We have got just the thing! Our diverse array of fitness classes will get you moving, no matter your level of experience. Choose from high-intensity interval training (HIIT), yoga, Pilates, strength training, cardio workouts, spinning, and so much more. We pride ourselves on crafting engaging and effective classes that cater to the unique needs and preferences of our clients.

·        With Personal Training, you'll get the kickstart you need. We'll create a customized plan for you based on your needs, abilities, and goals with the help of our experienced trainers. They'll be with you every step of the way, showing you the correct techniques and offering guidance, and, most importantly, keeping you motivated. Say goodbye to cookie-cutter workouts and hello to optimal results.

·        Supportive Community: We prioritize creating a welcoming and inclusive environment for all members to connect and share their progress. Member satisfaction is important to us, and we have staff readily available to answer questions, provide guidance, and address concerns. We believe in fostering a supportive community where mutual inspiration is cultivated.

Embrace an active lifestyle and prioritize your well-being with FitflexStudio. Our goal is to promote self-improvement and instill a sense of empowerment in everyone. Ready to unlock your full potential? Come join us on this transformative fitness journey and feel the difference at FitflexStudio!

## App Title: 
FitflexStudio Domain Name: www.FitflexStudio.com
## Purpose of the App:
The purpose of the FitflexStudio app is to streamline and automate the management of our fitness studio operations. It serves as a centralized platform for managing member information, class schedules, membership options, and trainer details. The app aims to enhance the efficiency of our studio's administrative tasks, improve member engagement, and provide a seamless experience for both staff and members.
 
## Information Management Tasks Supported by the App:

### ·        Members:
1. Create: Allows the user to register a new member. The user needs to provide the member's ID, name, contact information, and any additional details.
2. Edit: Allows the user to edit the details of a member, such as their contact information, membership type, or payment details.
3. View: Displays the details of a member, including their ID, name, contact information, membership type, and payment details.
4. Delete: Removes a member from the system, including all associated information.

### ·        Classes:
5. Create: Allows the user to add a new fitness class to the schedule. The user needs to provide the class ID, name, instructor, duration, capacity, and any additional details.
6. Edit: Allows the user to edit the details of a class, such as its name, instructor, or capacity.
7. View: Displays the details of a class, including its ID, name, instructor, duration, capacity, and any additional details.
8. Delete: Removes a class from the schedule, including all associated information.

### ·        Membership:
9. Create: Allows the user to add a new membership option to the system. The user needs to provide the membership ID, name, duration, price, and any additional details.
10. Edit: Allows the user to edit the details of a membership option, such as its name, duration, or price.
11. View: Displays the details of a membership option, including its ID, name, duration, price, and any additional details.
12. Delete: Removes a membership option from the system, including all associated information.

### ·        Schedule:
13. View Schedule: Displays the class schedule, including class names, instructors, and timings.

### ·        Trainers:
14. Create: Allows the user to add a new trainer to the system. The user needs to provide the trainer's ID, name, contact information, and any additional details.
15. Edit: Allows the user to edit the details of a trainer, such as their contact information or additional details.
16. View: Displays the details of a trainer, including their ID, name, contact information, and any additional details.
17. Delete: Removes a trainer from the system, including all associated information.

##  Requirements Elaboration 
| Client's Requrements| Elaborated requirements| 
| --------------------| :--------------------: | 
| **Member**          |   a member is a person enrolled to the fitness studio    | 
| Create a new member |   Creating a a new club member record with:<br> (memberID, memberName, gender, birtDate, address, email, phone) <br> the Gender is either Male or Female <br> the member must be at least 16 years old <br> |  
| Update a member     |   Modify the data of an existing member     | 
| Delete a member     |   Delete an existing member     | 
| List of members     |   Shows the List of all memebrs with data   | 
| **class**    |  a member can particiapte different class available    | 
| Create a class    |   Creating a new course with: <br> (classId, className, instructor, startDate, endDate, capacity, registerdMembers)   | 
| Update a class     |   Modify Data of an existing class  | 
| Delete a class     |   Delete a class     | 
| List of classes     |   show the list of all classes with data     | 
| **membership**           |  once a member is enrolled to the fitness studio, he/she needs<br> to choose an option each option has its own caracteristics and requirements     | 
| Create a membership    |   Creating a new option with: <br> (optionId, optionName, price, duration)   | 
| Update a membership     |   Modify Data of an existing option  | 
| Delete a membership     |   Delete an option     | 
| list of membership     |   show the list of membership offered    | 
| **trainer**          |               | 
| Create a trainer     |   Creating a new trainer with: <br> (trainerId)   | 
| Update a trainer     |   Modify Data of an existing trainer  | 
| Delete a trainer     |   Delete a trainer     | 
| list of trainer     |   show  a list of trainer     | 
| **schedule**          |               | 
| Create a schedule     |   Creating a new schedule with: <br> (scheduleId, className, instructor, startDate, endDate, scheduleWeek, scheduleTime, duration)   | 
| Update a schedule     |   Modify Data of an existing schedule  | 
| Delete a schedule     |   Delete a schedule     | 
| list of schedule     |   show  a list of schedule     | 

## Domain Model
![domainModel](https://github.com/xpes/webapp23-FitflexStudio/assets/25884342/dc1b2904-9be2-4a38-8eed-adc32cec3c51)

## Design Model
![image](https://github.com/xpes/webapp23-FitflexStudio/blob/main/designModel.png)


## Separation of Work

| Developpers | Work| 
| --------------------| :--------------------: | 
|   Nour Elhouda Benaida    |   Domain Model <br>  Requirements Elaboration   | 
|   Elias George            |    Design Model <br> Requirements Elaboration   |  

