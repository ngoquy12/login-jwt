const express = require("express");
const server = express();
const port = 8000;
const morgan = require("morgan");
const connection = require("./connection/connectionMySQL");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(morgan());
server.use(cors());

server.post("/api/v1/register", (req, res) => {
  const { Email, Passwords, Roles } = req.body;
  const UserId = uuidv4();
  // Mã hóa mật khẩu
  bcrypt.hash(Passwords, 10, (err, hash) => {
    console.log(err);
    console.log(hash);
    if (err) {
      res.status(500).json({
        status: 500,
        message: err,
      });
    } else {
      // đối tượng user mới
      const newUser = [UserId, Email, hash, Roles];
      // Câu lệnh query
      const query =
        "INSERT INTO users(UserId, Email, Passwords, Roles) VALUES (?,?,?,?)";
      // Kêt nối
      connection.query(query, newUser, (err) => {
        if (err) {
          res.status(500).json({
            status: 500,
            message: err,
          });
        } else {
          return res.status(200).json({
            status: 200,
            message: "Thêm mới thành công",
          });
        }
      });
    }
  });
});

// API đăng nhập
server.post("/api/v1/login", (req, res) => {
  const { Email, Passwords } = req.body;
  // Lấy dữ liệu từ database
  const query = "SELECT * FROM users WHERE Email = ?";
  connection.query(query, [Email], (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: err,
      });
    } else {
      // Kiểm tra kết quả
      if (result.length == 0) {
        return res.status(400).json({
          message: "Email hoặc mật khẩu không đúng",
        });
      } else {
        // Nếu như có tồn tại email
        const user = result[0];
        // So sánh mật khẩu từ client với server
        bcrypt.compare(Passwords, user.Passwords, (err, isMatch) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              status: 500,
              message: err,
            });
          } else {
            if (!isMatch) {
              return res.status(400).json({
                message: "Email hoặc mật khẩu không đúng",
              });
            } else {
              // Tạo ra một chuỗi token
              const token = jwt.sign({ id: user.UserId }, "your_srcet_key", {
                expiresIn: "1h",
              });
              return res.status(200).json({
                status: 200,
                message: "Đăng nhập thành công",
                data: user,
                token,
              });
            }
          }
        });
      }
    }
  });
});

server.listen(port, (req, res) => {
  console.log(`http://localhost:${port}`);
});
