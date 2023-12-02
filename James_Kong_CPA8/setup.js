const Event = require("./models/event")
const User = require('./models/user');
const Job = require('./models/job')

// Function to add a sample user to the database
const addSampleUserToDatabase = async () => {
  const sampleUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    password: "securepassword",
    role: "alumni",
    graduationYear: 2020,
    major: "Computer Science",
    job: "Software Engineer",
    company: "TechCo",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    zipCode: 94105,
    bio: "Passionate about technology and innovation.",
    interests: ["Programming", "Machine Learning"],
  };

  try {
    // Check if the user already exists by email
    const existingUser = await User.findOne({ email: sampleUser.email });

    if (!existingUser) {
      await User.register(new User(sampleUser), sampleUser.password);
      console.log("Sample user added to the database successfully!");
    } else {
      console.log(`User with email '${sampleUser.email}' already exists. Skipping.`);
    }
  } catch (error) {
    console.error("Error adding sample user to the database:", error);
  }
};

module.exports = {
    // Function to add events to the database
    addEventsToDatabase : async () => {
        await addSampleUserToDatabase();
        const sampleUser = await User.findOne({ email: "john.doe@example.com" });
        const eventsToAdd = [
            {
                title: "Celebrate Brandeis at 75",
                description: "Join the entire Brandeis community for an anniversary celebration 75 years in the making.",
                location: "Waltham, Massachusetts",
                startDate: new Date("2023-10-13"),
                endDate: new Date("2023-10-15"),
                registrationLink: "event_1",
                organizer: sampleUser._id
            },
            {
                title: "Wien Buffet Dinner and Drinks",
                description: "Help Brandeis recruit more fellow Brandeisians to enjoy the same experience that you did!",
                location: "Location: Napoli Room | Gosman Sports and Convocation Center | Waltham, Massachusetts",
                startDate: new Date("2023-10-13"),
                endDate: new Date("2023-10-13"),
                registrationLink: "event_2",
                organizer: sampleUser._id
            },
            {
                title: "Brandeis International Business School NYC Networking",
                description: "We are coming to NYC and want to see you! Join Brandeis International Business School for a networking event on Wednesday, October 18 at The Smith - Nomad. Meet and mingle with fellow alumni from the area, International Business School faculty, staff, and a group of students in town on a Finance Industry Trek.  This event is sponsored by Brandeis International Business School Alumni Relations and the Career Strategies and Engagement Center. All alumni are welcome.",
                location: "The Smith - NoMad | 1150 Broadway, New York, NY 10001",
                startDate: new Date("2023-10-18"),
                endDate: new Date("2023-10-20"),
                registrationLink: "event_3",
                organizer: sampleUser._id
            },
        ];
    
        try {
            for (const eventData of eventsToAdd) {
                // Check if the event already exists by title and start date
                const existingEvent = await Event.findOne({
                    title: eventData.title,
                    startDate: eventData.startDate,
                });
        
                if (!existingEvent) {
                    // Event does not exist, create a new one
                    const newEvent = new Event(eventData);
                    await newEvent.save();
                } else {
                    console.log(`Event '${eventData.title}' already exists. Skipping.`);
                }
            }
            console.log("Events added to the database successfully!");
        } catch (error) {
            console.error("Error adding events to the database:", error);
        }
    },
    addSampleJobsToDatabase: async () => {
        await addSampleUserToDatabase();
        const jobsToAdd = [
          {
            title: "Brandeis Alumni Coordinator",
            company: "Brandeis University",
            location: "Waltham, Massachusetts",
            description: "Work with fellow alumni members to organize and plan events and gatherings!",
            requirements: "Excellent organizational and communication skills",
            salary: 50000,
            contactEmail: "jobs@brandeis.edu",
            contactPhone: "555-1234",
            deadlineDate: new Date("2023-11-01"),
          },
          {
            title: "Brandeis Recruiter",
            company: "Brandeis University",
            location: "Waltham, Massachusetts",
            description: "Help Brandeis recruit more fellow Brandeisians to enjoy the same experience that you did!",
            requirements: "Experience in recruitment and strong interpersonal skills",
            salary: 60000,
            contactEmail: "jobs@brandeis.edu",
            contactPhone: "555-5678",
            deadlineDate: new Date("2023-10-15"),
          },
          {
            title: "Brandeis International Ambassador At Copenhagen",
            company: "Brandeis University",
            location: "Copenhagen, Denmark",
            description: "Our Brandeis at Copenhagen program needs on-duty staff to participate in the facilitation of the program in Denmark.",
            requirements: "Fluency in English and Danish",
            salary: 55000,
            contactEmail: "jobs@brandeis.edu",
            contactPhone: "555-9876",
            deadlineDate: new Date("2023-09-30"),
          },
        ];
      
        try {
          for (const jobData of jobsToAdd) {
            // Check if the job already exists by title and deadline date
            const existingJob = await Job.findOne({
              title: jobData.title,
              deadlineDate: jobData.deadlineDate,
            });
      
            if (!existingJob) {
              // Job does not exist, create a new one
              const newJob = new Job(jobData);
              await newJob.save();
            } else {
              console.log(`Job '${jobData.title}' already exists. Skipping.`);
            }
          }
          console.log("Jobs added to the database successfully!");
        } catch (error) {
          console.error("Error adding jobs to the database:", error);
        }
    }
}