import { Router } from 'express';
import {
  getChallenges,
  getChallengeById,
  submitChallenge,
  getUserSubmissions,
  getChallengeStats,
} from '../controllers/challenge.controller';

const router = Router();

// Challenge routes
router.get('/challenges', getChallenges);
router.get('/challenges/:id', getChallengeById);
router.get('/challenges/:id/stats', getChallengeStats);

// Submission routes
router.post('/challenges/submit', submitChallenge);
router.get('/submissions', getUserSubmissions);

export default router;
