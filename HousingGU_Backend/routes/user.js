const express = require("express");
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const user = express.Router();

user.post("/user/addPreferences", async (req, res) => {
	try {
		console.log(req.body);
		const { genderPreference, bedtime, tidiness, smoking, willingToLiveWithSmoker, freeTime, friendsVisit, petsComfortable, petPreferences, noiseLevel, cookingFrequency, sharingBelongings, overnightGuests, cleaningDuties, workSchedule, spaceUsage, hobbies, privacyExpectation, allergies, longTermPlans, billSplit, conflictResolution } = req.body;

		// Check for empty string values
		if (!genderPreference || !bedtime || !tidiness || !smoking || !willingToLiveWithSmoker || !freeTime || !friendsVisit || !petsComfortable || !petPreferences.comfortable || !petPreferences.owned || !noiseLevel || !cookingFrequency || !sharingBelongings || !overnightGuests || !cleaningDuties || !workSchedule || !spaceUsage || !hobbies || !privacyExpectation || !allergies.value || !longTermPlans || !billSplit || !conflictResolution) {
			return res.status(400).json({ message: "Missing required fields" });
		}
		const preference = await prisma.preference.create({
			data: {
				genderPreference,
				bedtime,
				tidiness,
				smoking,
				willingToLiveWithSmoker,
				freeTime,
				friendsVisit,
				petsComfortable,
				comfortable: petPreferences.comfortable,
				owned: petPreferences.owned,
				ownedPetsDescription: petPreferences.ownedPetsDescription,
				noiseLevel,
				cookingFrequency,
				sharingBelongings,
				overnightGuests,
				cleaningDuties,
				workSchedule,
				spaceUsage,
				hobbies,
				privacyExpectation,
				allergiesValue: allergies.value,
				allergiesDescription: allergies.description,
				longTermPlans,
				billSplit,
				conflictResolution,
				userId: req.user.id,
			},
		});
		const updateUser = await prisma.user.update({
			where: {
				id: req.user.id,
			},
			data: {
				PreferenceFilled: true,
			},
		});
		res.status(201).json({ message: "Preference created successfully", preference });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
});
module.exports = user;
