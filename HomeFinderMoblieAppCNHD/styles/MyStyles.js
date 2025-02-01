import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window"); // Lấy chiều rộng màn hình

const MyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9", // Màu nền sáng hơn
    padding: 20, // Padding cho màn hình
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Căn đều các phần tử
  },
  margin: {
    marginHorizontal: 10, // Thêm margin để các phần tử không chật chội
  },
  image: {
    width: width * 0.8, // Chiếm 80% chiều rộng màn hình
    height: 200,
    borderRadius: 15, // Mềm mại hơn với borderRadius lớn hơn
    marginBottom: 20, // Khoảng cách dưới ảnh
  },
  subject: {
    fontSize: 26, // Font size lớn hơn để dễ nhìn
    color: "#4A90E2", // Màu xanh dễ nhìn
    fontWeight: "bold",
    textAlign: "center", // Căn giữa văn bản
    marginBottom: 20, // Thêm khoảng cách dưới tiêu đề
  },
  box: {
    width: 90,
    height: 90,
    borderRadius: 15,
    backgroundColor: "#fff", // Đảm bảo nền trắng sáng
    alignItems: "center", 
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5, // Tạo bóng nhẹ
    marginBottom: 15, // Khoảng cách giữa các box
  },
  textCenter: {
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4CAF50", // Màu xanh lá cây dễ nhìn
    paddingVertical: 12, // Tăng padding dọc
    borderRadius: 8, // Đường bo tròn đẹp mắt
    marginVertical: 10, // Khoảng cách giữa các nút
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16, // Tăng cỡ chữ
    textAlign: "center", // Căn giữa văn bản
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd", // Màu nhẹ cho border
    padding: 12, // Thêm padding cho input
    borderRadius: 8, // Đường bo tròn
    marginBottom: 15, // Khoảng cách dưới input
    backgroundColor: "#fff", // Nền input sáng
  },
  errorText: {
    color: "red",
    fontSize: 14, // Chữ lớn hơn cho lỗi
    marginTop: 5,
  },

  // Avatar Styles
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 120, // Tăng kích thước avatar
    height: 120,
    borderRadius: 60, // Avatar tròn đẹp mắt
    borderWidth: 3,
    borderColor: "#fff", // Thêm border trắng quanh avatar
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5, // Bóng cho avatar
  },

  // Profile Styles
  profileCard: {
    width: "100%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#fff", // Nền trắng cho profile card
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // Bóng đổ nhẹ
    marginBottom: 30, // Khoảng cách dưới profile card
  },
  username: {
    fontSize: 22, // Cỡ chữ lớn hơn
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333", // Màu chữ tối hơn để dễ đọc
    textAlign: "center", 
  },
  infoContainer: {
    marginTop: 10,
  },
  infoText: {
    fontSize: 16, // Cỡ chữ vừa phải
    color: "#555", // Màu xám nhạt cho thông tin
    marginBottom: 5, // Khoảng cách giữa các thông tin
  },
});

export default MyStyles;
