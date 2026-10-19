import { useState } from "react";
import "./App.css";
import ecodomoImg from "./assets/ecodomo-img-1.png";

function App() {
  const [status, setStatus] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const contact = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      setStatus("Sending message...");

      const response = await fetch("http://localhost:8080/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(contact).toString(),
      });

      const result = await response.text();

      if (!response.ok) {
        throw new Error(result);
      }

      setStatus(result);
      form.reset();

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("Message sent successfully!");
      form.reset();
    } catch (error) {
      setStatus(
        "Could not send message. Please check that the Java backend is running.",
      );
      console.error(error);
    }
  }

  return (
    <div>
      {" "}
      <nav>
        <h2>BUILDCORE</h2>

        <ul>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#projects">Projects</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>
      <section
        className="hero"
        id="home"
        style={{ backgroundImage: `url(${ecodomoImg})` }}
      >
        <h1>Building Your Vision, Creating Your Future.</h1>
        <p>
          We deliver reliable construction solutions, exceptional quality, and
          lasting results.
        </p>
        <button>Explore Our Services</button>
      </section>
      <section className="services" id="services">
        <div className="section-heading">
          <p className="section-label">WHAT WE DO</p>
          <h2>Our Construction Services</h2>
          <p>
            We provide reliable construction solutions designed to bring your
            ideas to life.
          </p>
        </div>

        <div className="services-container">
          <div className="service-card">
            <h3>Building Construction</h3>
            <p>
              From residential homes to commercial buildings, we deliver quality
              construction built to last.
            </p>
          </div>

          <div className="service-card">
            <h3>Renovation &amp; Remodeling</h3>
            <p>
              We transform existing spaces into modern, functional, and
              beautiful environments.
            </p>
          </div>

          <div className="service-card">
            <h3>Project Management</h3>
            <p>
              We coordinate construction activities, resources, and schedules to
              keep projects on track.
            </p>
          </div>
        </div>
      </section>
      <section className="about" id="about">
        <div className="about-content">
          <p className="section-label">ABOUT BUILDCORE</p>
          <h2>Building With Excellence and Integrity</h2>
          <p>
            At BUILDCORE, we are committed to delivering dependable construction
            services that meet the highest standards of quality and safety.
          </p>
          <p>
            From planning to completion, our team focuses on innovative
            solutions, excellent workmanship, and customer satisfaction.
          </p>

          <div className="about-stats">
            <div>
              <h3>Quality</h3>
              <p>Built to Last</p>
            </div>
            <div>
              <h3>Safety</h3>
              <p>Our Priority</p>
            </div>
            <div>
              <h3>Trust</h3>
              <p>Our Foundation</p>
            </div>
          </div>
        </div>
      </section>
      <section className="projects" id="projects">
        <div className="section-heading">
          <p className="section-label">OUR WORK</p>
          <h2>Featured Projects</h2>
          <p>
            Explore some of the construction services and projects we specialise
            in.
          </p>
        </div>

        <div className="projects-container">
          <div className="project-card">
            <div className="project-number">01</div>
            <h3>Residential Construction</h3>
            <p>
              Building comfortable, modern homes designed to meet our clients'
              needs.
            </p>
            <span>Residential</span>
          </div>

          <div className="project-card">
            <div className="project-number">02</div>
            <h3>Commercial Buildings</h3>
            <p>
              Creating functional spaces for businesses, offices, and commercial
              activities.
            </p>
            <span>Commercial</span>
          </div>

          <div className="project-card">
            <div className="project-number">03</div>
            <h3>Renovation Projects</h3>
            <p>
              Improving existing buildings through renovation, repairs, and
              modernisation.
            </p>
            <span>Renovation</span>
          </div>
        </div>
      </section>
      <section className="contact" id="contact">
        <div className="section-heading">
          <p className="section-label">GET IN TOUCH</p>
          <h2>Let's Discuss Your Project</h2>
          <p>
            Have a construction project in mind? Send us a message and our team
            will get back to you.
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="What is your project about?"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              placeholder="Tell us about your project..."
              required
            />
          </div>

          <button type="submit">Send Message</button>

          {status && <p role="status">{status}</p>}
        </form>
      </section>
    </div>
  );
}

export default App;
