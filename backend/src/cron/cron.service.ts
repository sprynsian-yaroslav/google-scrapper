import { Injectable } from '@nestjs/common';
import { Keyword } from '../../types/keyword/keyword.type';
import { ScheduledTask } from './scheduled-task.service';
import { HOURLY_SCHEDULE } from './constants';

@Injectable()
export class CronService {
  private keywordTasks: Record<string, ScheduledTask> = {};

  startTask(keyword: Keyword, action: () => void) {
    if (!this.keywordTasks[keyword.id]) {
      const task = new ScheduledTask(action, HOURLY_SCHEDULE);
      this.keywordTasks[keyword.id] = task;
      task.start();
    }
  }

  stopTask(keywordId: string) {
    if (this.keywordTasks[keywordId]) {
      this.keywordTasks[keywordId].stop();
      delete this.keywordTasks[keywordId];
    }
  }
}
