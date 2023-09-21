import Navbar from "@/components/Navbar/Navbar";
import { useState } from "react";
import axios from "axios";
import styles from "@/styles/About.module.css";
import Image from "next/image";
import vida from "../images/vida.png";
import megan from "../images/megan.png";
import andrea from "../images/andrea.jpg";
import { toast } from "react-toastify";

const About = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [clicked, setClicked] = useState(false);

  const handleButtonClick = () => {
    setClicked(true);
  };

  const handleButtonRelease = () => {
    setClicked(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await axios.post("/api/send-feedback", { name, email, message });
      console.log(name, email, message);
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
      toast.success("Feedback submitted successfully!");
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
            AdiesCapstoneHub is a web application that allows{" "}
            <a
              href="https://adadevelopersacademy.org//"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              Ada Developer Academy
            </a>{" "}
            students to showcase their apps and connect with potential users.
            The app has two main modes: developer mode and user mode. In
            developer mode, developers can create and manage app cards, which
            contain information about their app, such as the app name, category,
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
            <h2>Vida Maleki</h2>
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
          <div className={styles.aboutCreators}>
            <a
              href="https://www.linkedin.com/in/andrygzt/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={andrea} alt="" width={50} height={50} />
            </a>
            <h2>Andrea Garcia Zapata</h2>
            <p>Software Engineer</p>
          </div>
        </div>
        <div className="mt-10 mb-10 w-[100%] flex flex-col px-12 py-4 sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/3 h-full bg-white flex items-center justify-center">
          <h2 className="text-gray-700">Give us your feedback</h2>
          <p className="text-gray-700">
            Found a bug? Have a suggestion? Please send us your feedback to
            improve our platform.
          </p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name" className="text-gray-700">Name:</label>
            <input
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="email" className="text-gray-700">Email:</label>
            <input
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="message" className="text-gray-700">Message:</label>
            <textarea
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-teal-200 drop-shadow text-gray-700 px-4 py-2 rounded-md"
                onClick={handleButtonClick}
                onMouseUp={handleButtonRelease}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default About;
