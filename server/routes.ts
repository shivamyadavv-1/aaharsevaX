import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === Donations Routes ===
  app.get(api.donations.list.path, async (_req, res) => {
    const results = await storage.getDonations();
    res.json(results);
  });

  app.post(api.donations.create.path, async (req, res) => {
    try {
      const input = api.donations.create.input.parse(req.body);
      const donation = await storage.createDonation(input);
      res.status(201).json(donation);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // === NGO Requests Routes ===
  app.get(api.ngoRequests.list.path, async (_req, res) => {
    const results = await storage.getNgoRequests();
    res.json(results);
  });

  app.post(api.ngoRequests.create.path, async (req, res) => {
    try {
      const input = api.ngoRequests.create.input.parse(req.body);
      const request = await storage.createNgoRequest(input);
      res.status(201).json(request);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.inventory.list.path, async (_req, res) => {
    const results = await storage.getInventory();
    res.json(results);
  });

  // Seed data function
  async function seedData() {
    const existingDonations = await storage.getDonations();
    if (existingDonations.length === 0) {
      await storage.createDonation({
        donorName: "Anjali's Kitchen",
        contactNumber: "9876543210",
        foodType: "Cooked",
        quantity: "For 50 people",
        city: "Mumbai",
        area: "Andheri West",
        isFresh: true
      });
      await storage.createDonation({
        donorName: "City Hostel Mess",
        contactNumber: "9988776655",
        foodType: "Packed",
        quantity: "100 packets of biscuits",
        city: "Delhi",
        area: "Laxmi Nagar",
        isFresh: true
      });
    }

    const existingRequests = await storage.getNgoRequests();
    if (existingRequests.length === 0) {
      await storage.createNgoRequest({
        ngoName: "Helping Hands Foundation",
        contactNumber: "9123456789",
        requirements: "Rice and Dal for 100 children",
        city: "Mumbai"
      });
    }
  }

  // Run seeder
  seedData().catch(console.error);

  return httpServer;
}
