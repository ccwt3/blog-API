export const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccesStatus: 200,
  credentials: true,
  allowedHeaders: ["Content-Type"],
  methods: ["POST", "GET", "PUT", "DELETE"],
};
