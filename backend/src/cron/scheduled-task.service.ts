import { CronJob } from 'cron';

export class ScheduledTask {
  private cronJob: CronJob;

  constructor(
    private action: () => void,
    private schedule: string,
  ) {
    this.cronJob = new CronJob(
      schedule,
      () => {
        this.action();
      },
      null,
      false,
      'UTC',
    );
  }

  start() {
    this.cronJob.start();
  }

  stop() {
    this.cronJob.stop();
  }
}
