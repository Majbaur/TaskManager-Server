const express = require("express");
const cors = require('cors');
const port=process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())