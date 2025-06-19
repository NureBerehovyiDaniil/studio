// src/ai/flows/predict-delivery-delay.ts
'use server';

/**
 * @fileOverview Predicts potential delivery delays based on courier GPS data.
 *
 * - predictDeliveryDelay - A function that predicts delivery delays.
 * - PredictDeliveryDelayInput - The input type for the predictDeliveryDelay function.
 * - PredictDeliveryDelayOutput - The return type for the predictDeliveryDelay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictDeliveryDelayInputSchema = z.object({
  courierId: z.string().describe('The ID of the courier.'),
  orderId: z.string().describe('The ID of the order.'),
  currentLocationLat: z.number().describe('The current latitude of the courier.'),
  currentLocationLon: z.number().describe('The current longitude of the courier.'),
  destinationLat: z.number().describe('The destination latitude of the delivery.'),
  destinationLon: z.number().describe('The destination longitude of the delivery.'),
  estimatedArrivalTime: z.string().describe('The estimated arrival time of the delivery (ISO format).'),
  trafficConditions: z.string().describe('The current traffic conditions.'),
  weatherConditions: z.string().describe('The current weather conditions.'),
});
export type PredictDeliveryDelayInput = z.infer<typeof PredictDeliveryDelayInputSchema>;

const PredictDeliveryDelayOutputSchema = z.object({
  isDelayed: z.boolean().describe('Whether the delivery is predicted to be delayed.'),
  delayReason: z.string().describe('The predicted reason for the delay.'),
  estimatedDelayTime: z.string().describe('The estimated delay time (ISO format).'),
  confidenceScore: z.number().describe('The confidence score of the delay prediction (0-1).'),
});
export type PredictDeliveryDelayOutput = z.infer<typeof PredictDeliveryDelayOutputSchema>;

export async function predictDeliveryDelay(input: PredictDeliveryDelayInput): Promise<PredictDeliveryDelayOutput> {
  return predictDeliveryDelayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictDeliveryDelayPrompt',
  input: {schema: PredictDeliveryDelayInputSchema},
  output: {schema: PredictDeliveryDelayOutputSchema},
  prompt: `You are an expert delivery delay prediction system.

  Based on the courier's current location, order destination, estimated arrival time,
  traffic conditions, and weather conditions, predict whether the delivery will be delayed.

  Courier ID: {{{courierId}}}
  Order ID: {{{orderId}}}
  Current Location (Lat, Lon): {{{currentLocationLat}}}, {{{currentLocationLon}}}
  Destination (Lat, Lon): {{{destinationLat}}}, {{{destinationLon}}}
  Estimated Arrival Time: {{{estimatedArrivalTime}}}
  Traffic Conditions: {{{trafficConditions}}}
  Weather Conditions: {{{weatherConditions}}}

  Respond with a JSON object including:
  - isDelayed (boolean): true if the delivery is predicted to be delayed, false otherwise.
  - delayReason (string): The predicted reason for the delay.
  - estimatedDelayTime (string): The estimated delay time in ISO format.
  - confidenceScore (number): The confidence score of the delay prediction (0-1).
  `,
});

const predictDeliveryDelayFlow = ai.defineFlow(
  {
    name: 'predictDeliveryDelayFlow',
    inputSchema: PredictDeliveryDelayInputSchema,
    outputSchema: PredictDeliveryDelayOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
