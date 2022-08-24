import { categoryCl, usersCl, videosCl } from "./db";

export const genUserId = async () => {
    const newId = (await usersCl.countDocuments()) + 1;
    const newUserId = String(newId).split("");
    while (newUserId.length < 7) newUserId.unshift("0");
    return newUserId.join("");
};

export const genCategoryId = async () => {
    return (await categoryCl.countDocuments()) + 1;
};

export const genVideoId = async () => {
    const date = new Date().toISOString().split("T")[0].split("-").join("").slice(2);
    let newId = String(
        (await videosCl.countDocuments({ videoId: new RegExp(`^${date}\\d+$`) })) + 1
    );
    while (newId.length < 3) newId = "0" + newId;
    return `${date}${newId}`;
};
