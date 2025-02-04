import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const MyStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f1f1f1",  // Softer background color
  },
  errorText: {
    color: "#FF6347",  // Highlight error text with a bright color
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  inputWrapper: {
    marginBottom: 25,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,  // Rounded input fields
    borderWidth: 1,
    borderColor: "#e0e0e0",
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  image: {
    width: width * 0.85,
    height: 220,
    borderRadius: 15,
    marginBottom: 25,
    resizeMode: "cover",
  },
  subject: {
    fontSize: 30,
    color: "#4A90E2",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#56CCF2",  // Soft blue button color
    paddingVertical: 14,
    borderRadius: 10,  // Rounded buttons
    marginVertical: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  imagePicker: {
    marginBottom: 20,
    paddingVertical: 12,
    borderColor: "#56CCF2",  // Match button color
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  imagePickerText: {
    color: "#56CCF2",  // Soft blue color for text
    fontWeight: "bold",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  profileCard: {
    width: "100%",
    padding: 25,
    borderRadius: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 30,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  infoContainer: {
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  card: {
    marginBottom: 25,
    borderRadius: 12,
    elevation: 5,
    backgroundColor: "white",
    padding: 20,
    shadowColor: "#ddd",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: "#FF6347",
    fontWeight: "600",
    marginVertical: 5,
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: "#777",
    marginBottom: 10,
  },
  commentSection: {
    marginTop: 25,
  },
  commentTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  divider: {
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  noCommentText: {
    color: "#888",
    textAlign: "center",
  },
  commentItem: {
    flexDirection: "row",
    marginVertical: 12,
    alignItems: "center",
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 16,
    fontWeight: "bold",
  },
  commentText: {
    fontSize: 14,
    color: "#444",
  },
  commentInput: {
    marginTop: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "white",
    fontSize: 16,
  },
  commentButton: {
    marginTop: 20,
    backgroundColor: "#FF6347",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#56CCF2",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  noInfoText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 25,
    color: "#888",
  },
});

export default MyStyles;
