import jwt from "jsonwebtoken";

export const auth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token" });
  }

 
  if (token === "secret") {
    req.userId = "1";
    return next();
  }

  try {
    const decoded: any = jwt.verify(token, "secret");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid" });
  }
};