import { StyleSheet } from "react-native";

const MyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light background color
    padding: 20, // Add some padding for better readability
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Space elements evenly
  },
  margin: {
    marginHorizontal: 5, // Apply margin horizontally
  },
  image: {
    width: width * 0.8, // Chiếm 80% chiều rộng màn hình
    height: 200,
    borderRadius: 10,
  },
  subject: {
    fontSize: 25,
    color: "blue",
    fontWeight: "bold",
    textAlign: "center", // Center the text
  },
  box: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#fff', // Add a background color to the box
    alignItems: 'center', // Center content vertically
    justifyContent: 'center', // Center content horizontally
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android
  },
  textCenter: {
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50', // Green button color
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default MyStyles;