import jwt from "jsonwebtoken";
export default function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Unauthorized: No token provided");
    error.status = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    const error = new Error("Unauthorized: Invalid token");
    error.status = 401;
    next(error);
  }
}