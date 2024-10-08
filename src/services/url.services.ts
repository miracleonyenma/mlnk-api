import { nanoid } from "nanoid";
import URL from "../models/url.model.js";
import User from "../models/user.model.js";

const APP_URL = process.env.APP_URL || "http://localhost:8000";

const shortenURL = async ({
  url,
  userId,
  code,
}: {
  url: string;
  userId?: string;
  code?: string;
}) => {
  try {
    console.log("🪵🪵🪵🪵🪵", {
      url,
      userId,
      code,
    });

    // check if user exists
    const user = await User.findById(userId);

    if (!user) {
      // throw new Error("User does not exist");
      console.log("🚨🚨🚨🚨🚨 ~ error: User does not exist");
    }

    // check if code provided already exists
    const existingURL = await URL.findOne({ code });

    if (existingURL) {
      throw new Error("Code already exists");
    }

    const URLCode = code ? code : nanoid(6);
    const shortUrl = `${APP_URL}/${URLCode}`;

    const shortURL = (
      await URL.create({
        url,
        shortUrl,
        code: URLCode,
        user: userId,
      })
    ).populate("user");

    return shortURL;
  } catch (error: any) {
    console.log("🚨🚨🚨🚨🚨 ~ error: ", error);

    throw new Error(error);
  }
};

const findOriginalUrl = async (urlCode: string) => {
  try {
    const urlDoc = await URL.findOne({ code: urlCode });
    return urlDoc ? urlDoc.url : null;
  } catch (error: any) {
    console.log("🚨🚨🚨🚨🚨 ~ error: ", error);
    throw new Error(error);
  }
};

export { shortenURL, findOriginalUrl };
