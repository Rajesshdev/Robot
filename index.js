const express = require("express");
const mongoose = require("mongoose");
const RobotData = require("./models/data");
const cors = require("cors");
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

require("dotenv").config();
app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://rajessh781:R%40jesh2512@personal-blog.dtfxubi.mongodb.net/CodeBlog",
  { useNewUrlParser: true }
);

// Define Swagger options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Robot Data API",
      description: "API for managing robot data",
      version: "1.0.0",
    },
  },
  apis: [__filename], // Specify the current file (app.js) as the source of API documentation
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * tags:
 *   name: Data
 *   description: Operations related to Robot Data
 */

/**
 * @swagger
 * /data:
 *   get:
 *     summary: Get all robot data
 *     tags: [Data]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: [{"id": "1", "data": {"direction": "LEFT", "status": "Online"}}]
 * /data/status/{id}:
 *   put:
 *     summary: Update robot status
 *     tags: [Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the robot
 *         example: "1"
 *       - in: body
 *         name: body
 *         required: true
 *         description: New status for the robot
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *         example:
 *           status: "NewStatus"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: {"id": "1", "data": {"direction": "LEFT", "status": "NewStatus"}}
 *       404:
 *         description: Robot not found
 *       500:
 *         description: Internal Server Error
 * /data/direction/{id}:
 *   put:
 *     summary: Update robot direction
 *     tags: [Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the robot
 *         example: "1"
 *       - in: body
 *         name: body
 *         required: true
 *         description: New direction for the robot
 *         schema:
 *           type: object
 *           properties:
 *             direction:
 *               type: string
 *         example:
 *           direction: "RIGHT"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: {"id": "1", "data": {"direction": "RIGHT", "status": "Online"}}
 *       404:
 *         description: Robot not found
 *       500:
 *         description: Internal Server Error
 */

app.get("/data", async (req, res) => {
  try {
    const result = await RobotData.find({});
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put("/data/status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedRobot = await RobotData.findOneAndUpdate(
      { id },
      { "data.status": status },
      { new: true }
    );

    if (!updatedRobot) {
      return res.status(404).json({ error: "Robot not found" });
    }

    res.json(updatedRobot);
  } catch (err) {
    console.error("Error in put route:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/data/direction/:id", async (req, res) => {
  const { id } = req.params;
  const { direction } = req.body;

  try {
    const updatedRobot = await RobotData.findOneAndUpdate(
      { id },
      { "data.direction": direction },
      { new: true }
    );

    if (!updatedRobot) {
      return res.status(404).json({ error: "Robot not found" });
    }

    res.json(updatedRobot);
  } catch (err) {
    console.error("Error in put route:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
