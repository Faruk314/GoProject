import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:8080/api/status")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.text);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h1>Frontend calling Backend</h1>
      <p>Message from Go: {message || "Loading..."}</p>
    </div>
  );
}

export default App;
