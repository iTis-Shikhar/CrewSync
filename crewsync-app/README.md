# CrewSync - Volunteer Coordination & Shift Management

**Live Demo:** [**https://crewsynchackathon.web.app**]

---

## 🚀 The Problem

Managing student volunteers during large-scale events is often chaotic. Organizers struggle with messy spreadsheets, last-minute communication, and tracking who is supposed to be where and when. This leads to confusion, missed shifts, and a stressful experience for both the organizers and the dedicated volunteers.

## ✨ Our Solution

**CrewSync** is a real-time, role-based web application designed to replace that chaos with clarity and connection. It provides a powerful, centralized platform for event organizers to manage every aspect of their volunteer workforce, and a personalized, empowering dashboard for volunteers to stay informed and engaged.

---

## 🔑 Key Features

### For Event Organizers (Admins)
* **Professional Workspace:** A modern dashboard with a persistent sidebar for easy navigation between management sections.
* **Comprehensive Event Management:** Create multi-day events with start and end dates. View all events in a clean, card-based layout.
* **Advanced Volunteer Roster:** Instead of manually typing emails, admins can add volunteers from a searchable, multi-select directory of all registered users, making roster creation fast and error-free.
* **Detailed Shift Scheduling:** For each event, create specific shifts with unique dates, start times, and end times.
* **Real-Time Announcements:** Send instant announcements to all volunteers rostered for a specific event, ensuring everyone gets critical information immediately.
* **Two-Step Attendance Tracking:** A robust system where volunteers "Check-in" and admins "Confirm Presence," creating a verifiable attendance record.
* **Data-Driven Analytics:** A dedicated analytics page that provides at-a-glance insights into key metrics like Shift Coverage and Volunteer Attendance Rate.

### For Volunteers
* **Personalized Dashboard:** A clean, focused view of all assigned responsibilities.
* **Upcoming vs. Past Shifts:** The dashboard is intelligently split into "Upcoming Shifts" for active duties and a "Past Shifts" section for completed work.
* **Permanent Work History:** When an admin confirms a volunteer's attendance, the shift is moved to a permanent, undeletable work history, providing the volunteer with a lasting record of their contributions.
* **Live Announcements:** Receive instant updates and messages from the event organizer directly on the dashboard.
* **Gamification:** Earn badges for achievements like completing the first shift and maintaining a perfect attendance record, encouraging engagement and motivation.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (with Hooks & Context API for state management)
* **Backend & Database:** Google Firebase
    * **Firestore:** For our real-time, NoSQL database.
    * **Firebase Authentication:** For secure, role-based user management.
    * **Firebase Hosting:** For fast, global deployment.
* **Styling:** Custom CSS with a modern "Glassmorphism" theme and subtle animations.

---

## ⚙️ Running the Project Locally

1.  Clone the repository:
    ```bash
    git clone [https://github.com/iTis-Shikhar/CrewSync.git]
    ```
2.  Navigate into the project directory:
    ```bash
    cd crewsync-app
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env` file in the root of the project and add your Firebase API Key:
    ```
    REACT_APP_FIREBASE_API_KEY=YourApiKeyHere
    ```
5.  Start the development server:
    ```bash
    npm start
    ```

---

## 🚀 Next Steps & Future Ideas

* **Shift Swap Marketplace:** Allow volunteers to request swaps for their shifts, which admins can then approve.
* **In-App Chat:** Implement a simple chat feature for direct communication between organizers and volunteers within an event.
* **AI-Powered Scheduling:** Develop a feature that suggests the best volunteer for a shift based on their skills and past performance.


