import Navbar from "@/components/Navbar/Navbar";
import { useState } from "react";
import axios from "axios";
import styles from "@/styles/About.module.css";
import Image from "next/image";
import vida from "../images/vida.png";
import megan from "../images/megan.png";
import { toast } from "react-toastify";


const About = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await axios.post("/api/auth/send-email", { name, email, message });
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <div className={styles.aboutContainer}>
        <div className={styles.aboutTextWrapper}>
          <h2 className="font-bold text-lg">About Adies capstone Hub</h2>
          <p>
          AdiesCapstoneHub is a web application that allows{' '}
          <a
            href="https://adadevelopersacademy.org//"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            Ada Developer Academy
          </a>{' '}
          students to showcase their apps and connect with potential users. The app has
          two main modes: developer mode and user mode. In developer mode,
          developers can create and manage app cards, which contain
          information about their app, such as the app name, category,
          description, and a link to the app or website. In user mode, users
          can browse app cards and search for apps by category, name, or
          developer name.
        </p>
        </div>
        <div className={styles.aboutCreatorsWrapper}>
          <div className={styles.aboutCreators}>
            <a
              href="https://www.linkedin.com/in/vida-ghorbannezhad-maleki-4082a4197/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={vida} alt="" width={50} height={50} />
            </a>
            <h2>Vida Ghorbannezhad Maleki</h2>
            <p>Software Engineer</p>
          </div>
          <div className={styles.aboutCreators}>
            <a
              href="https://www.linkedin.com/in/megan-korling/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={megan} alt="" width={50} height={50} />
            </a>
            <h2>Megan Korling</h2>
            <p>Software Engineer</p>
          </div>
        </div>
        <div className={styles.aboutFeedbackWrapper}>
          <form className={styles["feedback-form"]} onSubmit={handleSubmit}>
            <div className={styles.aboutFeedbackHeader}>
              <h2>Send us your Feedback</h2>
              <button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Send"}
              </button>
            </div>
            {status === "sent" && (
              <p className={styles.successMessage}>
                Thank you for your feedback!
              </p>
            )}
            {status === "error" && (
              <p className={styles.errorMessage}>
                An error occurred. Please try again later.
              </p>
            )}
            <div>
              <label htmlFor="name">Name:</label>
              <input
                className={styles.feedbackSenderName}
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
          </form>
        </div>
        {status === "sent" && (
          <p className={styles.successMessage}>
            Thank you for your feedback! The email has been sent successfully.
          </p>
        )}
      </div>
    </div>
  );
};

export default About;
