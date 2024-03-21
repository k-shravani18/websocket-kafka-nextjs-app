// pages/api/messages.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { KafkaUtils } from '@/utils/KafkaUtils';
import ConsumerFactory from '../../../kafka/ConsumerFactory';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Access ConsumerFactory instance from KafkaUtils
    const consumerFactory: ConsumerFactory = KafkaUtils.getConsumerInstance('demo');
    const messages = consumerFactory.getReceivedMessages();
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
}
 