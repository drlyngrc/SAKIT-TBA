import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {getFirestore, getDoc, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js"
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject, getMetadata} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAgHwpcRfzNOVeJi8tEmMxPfm_g1I4eJT4",
    authDomain: "sakit-dbms-135c2.firebaseapp.com",
    projectId: "sakit-dbms-135c2",
    storageBucket: "sakit-dbms-135c2.firebasestorage.app",
    messagingSenderId: "1048882625699",
    appId: "1:1048882625699:web:b469ab6a3df154b8bb9316"
};
  
const app = initializeApp(firebaseConfig);

const auth=getAuth();
const userdb=getFirestore();

const navLogin = document.getElementById('nav-login');

// Sidebar elements
const sidebarInfo = document.getElementById("sidebar-info");
const historyButton = document.getElementById("history-button");
const signOutButton = document.getElementById("signout-button");

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User signed in:", user);
        const loggedInUserId = user.uid; // Use Firebase Auth UID as the identifier
        localStorage.setItem('loggedInUserId', loggedInUserId); // Store UID in localStorage for persistence
        

        // Retrieve user details from Firestore
        const docRef = doc(userdb, "users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    console.log("User data retrieved from Firestore:", userData);

                    // Update HTML with Firestore data
                    document.getElementById('loggedfname').innerText = userData.firstname || user.displayName?.split(' ')[0] || "N/A";
                    document.getElementById('loggedlname').innerText = userData.lastname || user.displayName?.split(' ')[1] || "N/A";
                    document.getElementById('loggedUsername').innerText = userData.username || "N/A";
                    document.getElementById('loggedEmail').innerText = userData.email || user.email || "N/A";

                    if (navLogin) {
                        navLogin.innerHTML = `
                            <button class="nav_button user_icon" onclick="openUserMenu()">
                                <i class="ri-user-line"></i>
                            </button>
                        `;
                    } 
                    
                    if (sidebarInfo) {
                        sidebarInfo.innerHTML = `
                            <h3>${userData.firstname || user.displayName?.split(' ')[0] || "N/A"} ${userData.lastname || user.displayName?.split(' ')[1] || ""}</h3>
                            <span>${userData.email || user.email || "N/A"}</span>
                        `;
                    }
                    
                } else {
                    console.warn("No document found in Firestore for this user. Using Auth data.");

                    // Use Auth data as fallback if Firestore document doesn't exist
                    document.getElementById('loggedfname').innerText = user.displayName?.split(' ')[0] || "N/A";
                    document.getElementById('loggedlname').innerText = user.displayName?.split(' ')[1] || "N/A";
                    document.getElementById('loggedUsername').innerText = user.displayName || "N/A";
                    document.getElementById('loggedEmail').innerText = user.email || "N/A";

                    navLogin.innerHTML = `
                        <button class="nav_button" onclick="window.location.href='login.html'">Login</button>
                    `;

                    sidebarInfo.innerHTML = `
                        <h3>${user.displayName || "N/A"}</h3>
                        <span>${user.email || "N/A"}</span>
                    `;
                }
            })
            .catch((error) => {
                console.error("Error retrieving Firestore document:", error);

                sidebarInfo.innerHTML = `
                    <h3>${user.displayName || "N/A"}</h3>
                    <span>${user.email || "N/A"}</span>
                `;
            });
            displayImages();
             // Show history and sign-out buttons
        historyButton.style.display = "";
        signOutButton.style.display = "";
    } else {
        console.warn("No user signed in.");
        localStorage.removeItem('loggedInUserId'); // Clear stored UID

        // Update sidebar info to show login button
        sidebarInfo.innerHTML = `
            <button class="login-button">Login</button>
        `;

        // Hide history and sign-out buttons
        historyButton.style.display = "none";
        signOutButton.style.display = "none";

        // Add event listener for the login button
        document.querySelector(".login-button").addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }
});

function openUserMenu() {
    window.location.href = 'hompage_upload.html';
}

// Sign-out logic
document.getElementById('signout-button').addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    sessionStorage.clear();
    signOut(auth)
        .then(() => {
            console.log("User signed out successfully.");
            auth.currentUser = null;
            window.location.href = "main.html";
        })
        .catch((error) => {
            console.error("Error signing out:", error);
        });
});

 

const inputFile = document.getElementById('file');
const imgArea = document.querySelector('.img-area');
const identifyButton = document.getElementById('upload_btn');
const resultMessage = document.getElementById('result-message');
let selectedImage = null;

const selectImage = document.getElementById('select_image');
if (selectImage) {
    selectImage.addEventListener('click', function () {
        inputFile.click();
    });
} 

inputFile.addEventListener('change', function () {
    const image = this.files[0];
    resultMessage.innerText = '';
    if (image.size < 5000000) {
        const reader = new FileReader();
        reader.onload = () => {
            const allImg = imgArea.querySelectorAll('img');
            allImg.forEach(item => item.remove());

            const img = new Image();
            img.src = reader.result;

            img.onload = () => {
                imgArea.style.width = '100%';
                imgArea.style.aspectRatio = `1 / 1`;
                imgArea.innerHTML = '';
                imgArea.appendChild(img);
                imgArea.classList.add('active');
                imgArea.dataset.img = image.name;
                selectedImage = image;
            };
        };
        reader.readAsDataURL(image);
    } else {
        alert("Image size more than 5MB");
    }
});

// Identify image
identifyButton.addEventListener('click', function () {
    if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        // Display processing message
        resultMessage.innerText = "Processing image, please wait...";
        resultMessage.style.color = "#555"; 

        fetch('http://localhost:5000/predict', { 
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Display the prediction result
            resultMessage.innerText = "Prediction: " + data.prediction;
            resultMessage.style.color = "#28a745";

            const uid = localStorage.getItem('loggedInUserId');
            if (uid && selectedImage) {
                const storage = getStorage();
                const storageRef = ref(storage, `users/${uid}/history/${selectedImage.name}`);

                // Upload the image to Firebase Storage
                const imageFile = selectedImage;
                uploadBytes(storageRef, imageFile).then((snapshot) => {
                    console.log("Image uploaded successfully!");

                    getDownloadURL(snapshot.ref).then((downloadURL) => {
                        const userHistoryRef = doc(userdb, "users", uid, "history", selectedImage.name);
                        setDoc(userHistoryRef, {
                            prediction: data.prediction,
                            imageUrl: downloadURL,
                            timestamp: new Date().toISOString(),
                        })
                        .then(() => {
                            console.log("Prediction and image URL saved to Firestore.");
                        })
                        .catch((error) => {
                            console.error("Error saving to Firestore:", error);
                        });
                    });
                }).catch((error) => {
                    console.error("Error uploading image:", error);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultMessage.innerText = "An error occurred while processing the image.";
            resultMessage.style.color = "#dc3545";
        });
    } else {
        alert("Please select an image first.");
    }
});


function predictDisease() {
    const fileInput = document.getElementById("file");
    const resultMessage = document.getElementById("result-message");

    if (fileInput.files.length === 0) {
        alert("Please select an image first.");
        return;
    }

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    resultMessage.innerText = "Processing image, please wait...";

    fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.prediction) {
            resultMessage.innerText = "Prediction: " + data.prediction;
            resultMessage.style.color = "green";
        } else {
            resultMessage.innerText = "An error occurred.";
            resultMessage.style.color = "red";
        }
    })
    .catch(error => {
        console.error("Error:", error);
        resultMessage.innerText = "An error occurred while processing the image.";
        resultMessage.style.color = "red";
    });
}

// Function to filter the table based on the selected disease
function filter() {
    const filterDropdown = document.getElementById('filter-dropdown');
    console.log('Filtering initialized');

    filterDropdown.addEventListener('change', function () {
        const filterValue = this.value.toLowerCase(); // Get the selected value from the dropdown
        console.log('Filter value changed to:', filterValue); // Debugging log

        const tableRows = document.querySelectorAll('#historyTableBody tr'); // Select all rows in the table body
        let noRecords = true; // Flag to track if any row is displayed

        // Clear any existing "No records found" row
        const tableBody = document.getElementById('historyTableBody');
        const existingNoRecordsRow = document.getElementById('no-records-row');
        if (existingNoRecordsRow) {
            tableBody.removeChild(existingNoRecordsRow);
        }

        tableRows.forEach(row => {
            const diseaseNameCell = row.querySelector('td:nth-child(2)'); // Assuming the disease name is in the second cell

            if (diseaseNameCell) {
                const diseaseName = diseaseNameCell.textContent.toLowerCase(); // Get the text of the disease name cell

                // Check if the filter matches the disease name or if "All Diseases" is selected
                if (filterValue === "" || diseaseName.includes(filterValue) || filterValue === "all diseases") {
                    row.style.display = ''; // Show the row
                    noRecords = false; // At least one record matches
                } else {
                    row.style.display = 'none'; // Hide the row
                }
            }
        });

        // Add a "No records found" row if no records match
        if (noRecords) {
            const noRecordsRow = document.createElement('tr');
            noRecordsRow.id = 'no-records-row'; // Set an ID for easy removal
            const noRecordsCell = document.createElement('td');
            noRecordsCell.colSpan = 4; // Adjust the colspan as needed
            noRecordsCell.textContent = 'No record found.';
            noRecordsCell.style.textAlign = 'center';
            noRecordsRow.appendChild(noRecordsCell);
            tableBody.appendChild(noRecordsRow);
        }
    });
}


// Function to display images and their history
function displayImages() {
    filter();
    console.log("Display images function called"); // Check if this logs in the console
    const userId = localStorage.getItem('loggedInUserId');
    if (!userId) {
        console.log("No user logged in.");
        return; // If no user is logged in, stop execution
    }
    const storage = getStorage();
    const imagesRef = ref(storage, `users/${userId}/history/`);
    const tableBody = document.getElementById("historyTableBody");

    tableBody.innerHTML = ""; // Clear any existing rows

    listAll(imagesRef)
        .then((result) => {
            console.log(result); // Check if this logs the result of the storage list
            if (result.items.length === 0) {
                const emptyRow = document.createElement("tr");
                const emptyCell = document.createElement("td");
                emptyCell.colSpan = 4;
                emptyCell.textContent = "No history found.";
                emptyCell.style.textAlign = "center";
                emptyRow.appendChild(emptyCell);
                tableBody.appendChild(emptyRow);
                return;
            }

            result.items.forEach((imageRef) => {
                Promise.all([getDownloadURL(imageRef), getMetadata(imageRef)])
                    .then(async ([url, metadata]) => {
                        console.log("Metadata and URL:", metadata, url); // Check if metadata and URL are correctly fetched
                        const tr = document.createElement("tr");

                        // Image Cell
                        const imgCell = document.createElement("td");
                        const imgElement = document.createElement("img");
                        imgElement.src = url;
                        imgElement.style.width = "100%"; // Adjust as needed
                        imgElement.alt = "Uploaded specimen";
                        imgCell.appendChild(imgElement);

                        // Disease Name Cell
                        const diseaseCell = document.createElement("td");

                        // Check if the metadata has a disease field
                        const disease = metadata.customMetadata?.disease;
                        if (disease) {
                            diseaseCell.textContent = disease;
                        } else {
                            // If no disease data in metadata, retrieve from Firestore
                            const userHistoryRef = doc(userdb, "users", userId, "history", imageRef.name);
                            const docSnap = await getDoc(userHistoryRef);
                            if (docSnap.exists()) {
                                const userHistoryData = docSnap.data();
                                if (userHistoryData.prediction) {
                                    diseaseCell.textContent = userHistoryData.prediction;
                                } else {
                                    diseaseCell.textContent = "Unknown"; // Fallback if prediction is not found
                                }
                            } else {
                                diseaseCell.textContent = "Unknown"; // Fallback if document doesn't exist
                            }
                        }

                        // Date Cell
                        const dateCell = document.createElement("td");
                        const lastModified = metadata.updated || metadata.timeCreated;
                        dateCell.textContent = new Date(lastModified).toLocaleDateString();

                        // Action Cell
                        const actionCell = document.createElement("td");
                        const deleteBtn = document.createElement("button");
                        deleteBtn.textContent = "Delete";
                        deleteBtn.style.cursor = "pointer";
                        deleteBtn.classList.add("delete-btn");
                        deleteBtn.addEventListener("click", () => {
                            deleteImage(imageRef, tr);
                        });
                        actionCell.appendChild(deleteBtn);

                        // Append cells to the row
                        tr.appendChild(imgCell);
                        tr.appendChild(diseaseCell);
                        tr.appendChild(dateCell);
                        tr.appendChild(actionCell);

                        tableBody.appendChild(tr);
                    })
                    .catch((error) => {
                        console.error("Error retrieving image or metadata:", error);
                    });
            });
        })
        .catch((error) => {
            console.error("Error listing images:", error);
        });
}

// Function to delete the image from Firebase Storage
function deleteImage(imageRef, rowElement) {
    deleteObject(imageRef)
        .then(() => {
            console.log("File deleted successfully");
            rowElement.remove(); // Remove the row from the table

            // Check if table is now empty and show "No history found" if necessary
            const tableBody = document.getElementById("historyTableBody");
            if (tableBody.children.length === 0) {
                const emptyRow = document.createElement("tr");
                const emptyCell = document.createElement("td");
                emptyCell.colSpan = 4;
                emptyCell.textContent = "No history found.";
                emptyCell.style.textAlign = "center";
                emptyRow.appendChild(emptyCell);
                tableBody.appendChild(emptyRow);
            }
        })
        .catch((error) => {
            console.error("Error deleting file:", error);
        });
}


