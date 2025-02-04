import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const MyStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  inputWrapper: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    height: 50,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  image: {
    width: width * 0.8,
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  subject: {
    fontSize: 26,
    color: "#4A90E2",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  box: {
    width: 90,
    height: 90,
    borderRadius: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 15,
  },
  textCenter: {
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FF6347",
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  imagePicker: {
    marginBottom: 20,
    paddingVertical: 10,
    borderColor: "#FF6347",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  imagePickerText: {
    color: "#FF6347",
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
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 30,
  },
  username: {
    fontSize: 22,
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
});

export default MyStyles;
