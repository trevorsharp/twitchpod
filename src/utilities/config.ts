class Config {
  private static instance: Config;
  readonly workingDirectory: string;
  readonly coverArtFileExtension: string;
  readonly hostname: string;

  private constructor() {
    this.workingDirectory = './data';
    this.coverArtFileExtension = '.png';

    this.hostname = process.env.HOSTNAME ?? this.validationError('Hostname', 'Missing');

    this.validate();
  }

  public static getInstance(): Config {
    if (!Config.instance) Config.instance = new Config();
    return Config.instance;
  }

  public getFeedDirectory = (feedId: string): string => `${this.workingDirectory}/${feedId}`;

  private validate = () => {
    if (!this.hostname.match(/^https?:\/\/[^\s$.?#].[^\s\/]*$/))
      this.validationError('Hostname', this.hostname);
  };

  private validationError = (propertyName: string, value: string) => {
    console.log(`Invalid ${propertyName} (${value}) - Please Check Your Configuration`);
    process.exit();
  };
}

export default Config.getInstance();
