// REST result object.
export interface RestResultModel {
  success: boolean;
  status?: number;
  error?: string;
  model?: any;
}

// REST request object.
export interface RestRequestModel {
  data?: any;
}
