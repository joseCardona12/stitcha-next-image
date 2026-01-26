export class JobService {
  public async startJob(prompt: string, generatedURLImage: string) {
    if (!prompt || !generatedURLImage) return;
    const endpoint: string = "/api/start-job";
    try {
      const result = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          urlImage: generatedURLImage,
        }),
      });
      if (!result.ok) throw new Error("Error to result ok");
      return await result.json();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  public async getStatus(jobID: string) {
    if (!jobID) return;
    const endpoint: string = `/api/job-status?jobId=${jobID}`;
    try {
      const result = await fetch(endpoint);
      if (!result.ok) throw new Error("Error get status");
      const data = await result.json();
      return data;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

export const jobService = new JobService();
