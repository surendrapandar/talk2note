// Selecting elements from the DOM using querySelector
const recordBtn = document.querySelector(".record"),
  result = document.querySelector(".result"),
  downloadBtn = document.querySelector(".download"),
  inputLanguage = document.querySelector("#language"),
  clearBtn = document.querySelector(".clear"),
  Notion_Btn = document.querySelector(".Notion")



// Define variables for SpeechRecognition and other related objects
let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition, // SpeechRecognition API
  recognition, // SpeechRecognition object
  recording = false; // Flag to track whether recording is in progress

// Function to populate language options in the input select dropdown
function populateLanguages() {
  // Iterate through an array of languages and create options for each
  languages.forEach((lang) => {
    const option = document.createElement("option"); // Create a new <option> element
    option.value = lang.code; // Set value attribute to language code
    option.innerHTML = lang.name; // Set innerHTML to language name
    inputLanguage.appendChild(option); // Append option to the input select dropdown
  });
}

// Call the populateLanguages function to populate language options
populateLanguages();

// Function to start speech recognition
function speechToText() {
  try {
    recognition = new SpeechRecognition(); // Create a new SpeechRecognition object
    recognition.lang = inputLanguage.value; // Set the language for recognition based on selected language
    recognition.interimResults = true; // Enable interim results
    recordBtn.classList.add("recording"); // Add 'recording' class to record button for styling
    recordBtn.querySelector("p").innerHTML = "Listening..."; // Update text content of record button
    recognition.start(); // Start speech recognition

    // Event listener for recognition result
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript; // Get transcribed speech result

      // Check if the result is final
      if (event.results[0].isFinal) {
        result.innerHTML += " " + speechResult; // Append final result to result element
        result.querySelector("p").remove(); // Remove any interim result placeholder
      } else {
        // If interim result, create a paragraph element with class 'interim' if not already present
        if (!document.querySelector(".interim")) {
          const interim = document.createElement("p");
          interim.classList.add("interim");
          result.appendChild(interim);
        }
        // Update the interim paragraph with the interim speech result
        document.querySelector(".interim").innerHTML = " " + speechResult;
      }
      downloadBtn.disabled = false; // Enable download button
    };

    // Event listener for when speech ends
    recognition.onspeechend = () => {
      speechToText(); // Restart speech recognition
    };

    // Event listener for recognition errors
    recognition.onerror = (event) => {
      stopRecording(); // Call stopRecording function to stop recording
      // Handle different types of recognition errors and display appropriate alerts
      if (event.error === "no-speech") {
        alert("No speech was detected. Stopping...");
      } else if (event.error === "audio-capture") {
        alert("No microphone was found. Ensure that a microphone is installed.");
      } else if (event.error === "not-allowed") {
        alert("Permission to use microphone is blocked.");
      } else if (event.error === "aborted") {
        alert("Listening Stopped.");
      } else {
        alert("Error occurred in recognition: " + event.error);
      }
    };
  } catch (error) {
    recording = false; // Set recording flag to false
    console.log(error); // Log any errors to the console
  }
}

// Event listener for record button click
recordBtn.addEventListener("click", () => {
  // If not currently recording, start speech recognition
  if (!recording) {
    speechToText();
    recording = true; // Set recording flag to true
  } else {
    stopRecording(); // If already recording, stop recording
  }
});

// Function to stop recording
function stopRecording() {
  recognition.stop(); // Stop speech recognition
  recordBtn.querySelector("p").innerHTML = "Start Listening"; // Update record button text
  recordBtn.classList.remove("recording"); // Remove 'recording' class from record button
  recording = false; // Set recording flag to false
}

// Function to download transcribed text
function download() {
  const text = result.innerText; // Get text content from result element
  const filename = "speech.txt"; // Set filename for downloaded file

  // Create a new <a> element to trigger download
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click(); // Simulate click event to trigger download
  document.body.removeChild(element); // Remove the <a> element from the DOM
}

// Event listener for download button click
downloadBtn.addEventListener("click", download);

// Event listener for clear button click
clearBtn.addEventListener("click", () => {
  result.innerHTML = ""; // Clear the result element
  downloadBtn.disabled = true; // Disable download button
});


// getting form values 
document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("notesForm");

  form.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Access input field values
    const heading = document.querySelector(".Heading").value;
    const description = document.querySelector(".Description").value;
    const source = document.querySelector(".Source").value;
    const tag = document.querySelector(".Tag").value;
    const secret = document.querySelector(".secret").value;
    const dbid = document.querySelector(".dbid").value;
    const voice_output = result.innerText

    // Create an object with form data
    const formData = {
      heading,
      description,
      source,
      tag,
      secret,
      dbid,
      voice_output
    };

    // Send form data to backend Node.js server using Axios
    axios.post("https://talk2note-fpa4.vercel.app/notion", formData)
    // axios.post("https://127.0.0.1:3000/notion", formData)
      .then(response => {
        console.log("Form data submitted successfully:", response.data);
        // Handle response from the server if needed
      })
      .catch(error => {
        console.error("Error submitting form data:", error);
        // Handle error if needed
      });

    // Additional logic to send data to Notion or perform other actions
  });
});


