import * as td from "testdouble";
import { expect } from "chai";
import mongoose from "mongoose";
import Event from "../../models/Event.js";
import * as eventService from "../../services/eventService.js";
import FieldExistingError from "../../errors/FieldExistingError.js";
import ValidationError from "../../errors/ValidationError.js";
import NotExist from "../../errors/NotExist.js";
describe("eventService", () => {
    afterEach(() => {
        td.reset();
    });
    describe("createEvent", () => {
        it("should throw FieldExistingError if the event already exists",
            async () => {
                const eventData = {
                    name: "Test Event",
                    sinceDate: new Date(),
                    untilDate: new Date(),
                };
                td.replace(Event, "findOne", td.function());
                td.when(Event.findOne({
                    name: eventData.name
                })).thenResolve(eventData);
                try {
                    await eventService.createEvent(eventData);
                } catch (error) {
                    expect(error).to.be.instanceOf(FieldExistingError);
                    expect(error.message).to.equal("El evento ya existe");
                }
            });
        it("should create a new event", async () => {
            const eventData = {
                name: "Test Event",
                sinceDate: new Date(),
                untilDate: new Date(),
            };
            td.replace(Event, "findOne", td.function());
            td.replace(Event, "create", td.function());
            td.when(Event.findOne({
                name: eventData.name
            })).thenResolve(null);
            td.when(Event.create(eventData)).thenResolve(eventData);
            const result = await eventService.createEvent(eventData);
            expect(result).to.equal(eventData);
        });
    });
    // describe("getEventById", () => {
    //     it("should throw ValidationError if the id is not a valid ObjectId", async () => {
    //         try {
    //             await eventService.getEventById("invalidId");
    //         } catch (error) {
    //             expect(error).to.be.instanceOf(ValidationError);
    //             expect(error.message).to.equal("El id debe ser un ObjectId");
    //         }
    //     });
    //     it("should return the event if found", async () => {
    //         const event = { _id: new mongoose.Types.ObjectId(), name: "Test Event" };
    //         td.replace(Event, "findOne", td.function());
    //         td.when(Event.findOne({ _id: event._id })).thenResolve(event);
    //         const result = await eventService.getEventById(event._id);
    //         expect(result).to.equal(event);
    //     });
    //     it("should throw NotExist if the event is not found", async () => {
    //         td.replace(Event, "findOne", td.function());
    //         td.when(Event.findOne({
    //             _id: td.matchers.anything()
    //         })).thenResolve(null);
    //         try {
    //             await eventService.getEventById(new mongoose.Types.ObjectId());
    //         } catch (error) {
    //             expect(error).to.be.instanceOf(NotExist);
    //             expect(error.message).to.equal("El evento no se encontro");
    //         }
    //     });
    // });
    describe("getCountEvents", () => {
        it("should return the count of events", async () => {
            const count = 5;
            td.replace(Event, "count", td.function());
            td.when(Event.count(td.matchers.anything())).thenResolve(count);
            const result = await eventService.getCountEvents(null, null, {});
            expect(result).to.equal(count);
        });
    });
    describe("deleteEventById", () => {
        it("should throw ValidationError if the id is not a valid ObjectId", async () => {
            try {
                await eventService.deleteEventById("invalidId");
            } catch (error) {
                expect(error).to.be.instanceOf(ValidationError);
                expect(error.message).to.equal("El id debe ser un ObjectId");
            }
        });
    it("should delete the event if found", async () => {
        const event = {
            _id: new mongoose.Types.ObjectId(), name: "Test Event" };
        td.replace(Event, "findByIdAndRemove", td.function());
        td.when(Event.findByIdAndRemove(event._id)).thenResolve(event);
        const result = await eventService.deleteEventById(event._id);
        expect(result).to.equal(event);
    });
    it("should throw NotExist if the event is not found", async () => {
        td.replace(Event, "findByIdAndRemove", td.function());
        td.when(Event.findByIdAndRemove(td.matchers.anything())).thenResolve(
            null
        );
        try {
            await eventService.deleteEventById(new
                mongoose.Types.ObjectId());
        } catch (error) {
            expect(error).to.be.instanceOf(NotExist);
            expect(error.message).to.equal("El evento no existe");
        }
    });
    });
});