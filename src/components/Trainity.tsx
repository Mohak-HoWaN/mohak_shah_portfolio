import { ArrowUpRight, FolderOpen } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// The Trainity internship shown as one folder holding its eight case studies.
// Every figure quoted comes from that study's own deck, notebook or chart.

interface Study {
  title: string;
  tools: string;
  summary: string;
  image?: { file: string; alt: string; width: number; height: number };
}

const studies: Study[] = [
  {
    title: "Data analytics process",
    tools: "Method",
    summary:
      "The six steps of an analytics project (plan, prepare, process, analyse, share, act) walked through on the Health Care Center build: a 132-symptom dataset, a support vector classifier and a Flask app deployed on Render.",
  },
  {
    title: "Instagram user analytics",
    tools: "SQL",
    summary:
      "Seven marketing and investor questions answered in MySQL on an Instagram-style database: the oldest accounts, users who never posted, the most-liked photo, the most used tags, the best weekday to launch ads, posts per user, and the 13 accounts that had liked every photo.",
    image: {
      file: "instagram-sql",
      alt: "A MySQL query selecting users whose like count equals the number of photos, and the 13 usernames it returns",
      width: 1000,
      height: 497,
    },
  },
  {
    title: "Operation analytics and metric spikes",
    tools: "SQL",
    summary:
      "Two case studies. Job reviews: throughput per hour and as a 7-day rolling average, share of each language, duplicate rows. Product metrics: weekly active users, signups, retention by signup cohort, engagement per device and email funnel rates.",
    image: {
      file: "operation-sql",
      alt: "A SQL query with two common table expressions that counts retained users per signup week and event week, above its result grid",
      width: 1000,
      height: 860,
    },
  },
  {
    title: "Hiring process analytics",
    tools: "Excel",
    summary:
      "Pivot tables and charts on a company's hiring records: offers by gender, salary bands, departments and post tiers. Operations made up 38.7% of hires, and most salaries fell between ₹40,000 and ₹80,000.",
    image: {
      file: "hiring-departments",
      alt: "Pie chart of hires by department: Operations 38.7%, Service 28.6%, Sales 10.4% and five smaller departments",
      width: 600,
      height: 371,
    },
  },
  {
    title: "IMDB movie analysis",
    tools: "Excel",
    summary:
      "What goes with a high IMDB score: descriptive statistics and trendlines by genre, runtime, language, director and budget. The average runtime was 1 h 47 min, and budget tracked gross earnings more closely than it tracked score.",
    image: {
      file: "imdb-duration",
      alt: "A spreadsheet of movie durations and scores with their mean, median, range and standard deviation, and a trendline of score against duration",
      width: 1000,
      height: 521,
    },
  },
  {
    title: "Bank loan case study",
    tools: "Python",
    summary:
      "Exploratory analysis in pandas and seaborn of 50,000 loan applications with 122 columns, joined to each applicant's earlier loans: a missing-value audit (car age was empty in 65.9% of rows), median and mode imputation, outliers in income and credit, and a correlation heatmap.",
    image: {
      file: "bank-loan-missing",
      alt: "Bar chart of the share of missing values in each column of the loan application data, many between 50% and 70%",
      width: 996,
      height: 553,
    },
  },
  {
    title: "Car features and price",
    tools: "Python",
    summary:
      "Which specifications move a car's list price. Engine horsepower had the strongest correlation with price (0.66), and a linear regression on four features explained 45% of the variance.",
    image: {
      file: "car-correlation",
      alt: "Correlation matrix of year, engine horsepower, cylinders, doors, mileage, popularity and list price",
      width: 873,
      height: 632,
    },
  },
  {
    title: "Call volume trend",
    tools: "Excel, Python",
    summary:
      "A call centre's inbound calls by hour: average call length, volume per hour (the 11 to 12 slot peaks at 14,626 calls), the agents each hour needs to bring the abandon rate from 30% to 10%, and a night-shift plan.",
    image: {
      file: "call-volume",
      alt: "Bar chart of calls per hourly bucket from 9 to 21, highest at 11 to 12 with 14,626 calls",
      width: 868,
      height: 496,
    },
  },
];

const Trainity = () => (
  <article className="grid gap-8 lg:grid-cols-12 lg:gap-10">
    <div className="lg:col-span-7">
      <div className="overflow-hidden rounded-lg border bg-card">
        <p className="flex items-center gap-2 border-b px-4 py-3 font-mono text-xs text-muted-foreground">
          <FolderOpen className="size-4 text-primary" strokeWidth={1.5} />
          trainity
          <span className="text-faint">/ {studies.length} case studies</span>
        </p>

        <Accordion type="single" collapsible>
          {studies.map((study, index) => (
            <AccordionItem key={study.title} value={study.title} className="px-4 last:border-b-0">
              <AccordionTrigger className="gap-3 py-3 text-left text-sm font-normal hover:no-underline [&>svg]:text-faint">
                <span className="font-mono text-xs tabular-nums text-faint">{String(index + 1).padStart(2, "0")}</span>
                <span className="flex-1">{study.title}</span>
                <span className="font-mono text-xs text-faint">{study.tools}</span>
              </AccordionTrigger>
              <AccordionContent className="pl-8">
                <p className="leading-relaxed text-muted-foreground">{study.summary}</p>
                {study.image && (
                  <img
                    src={`/project_images/trainity/${study.image.file}.webp`}
                    alt={study.image.alt}
                    width={study.image.width}
                    height={study.image.height}
                    loading="lazy"
                    className="mt-4 h-auto w-full rounded-sm border"
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>

    <div className="flex flex-col lg:col-span-5">
      <p className="font-mono text-sm text-faint">Virtual internship, 2024 to 2025</p>
      <h3 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">Trainity data analytics</h3>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Eight case studies, each a business question answered from raw data and written up as a deck: SQL on product and
        operations data, statistics in Excel, and exploratory analysis and regression in Python.
      </p>

      <dl className="mt-6 space-y-3 border-t pt-6 text-sm">
        <div className="grid grid-cols-[5rem_1fr] gap-4">
          <dt className="text-faint">Context</dt>
          <dd className="text-muted-foreground">Data Analytics virtual internship at Trainity, certificate 110777.</dd>
        </div>
        <div className="grid grid-cols-[5rem_1fr] gap-4">
          <dt className="text-faint">Stack</dt>
          <dd className="font-mono text-[13px] leading-relaxed text-muted-foreground">
            MySQL · Excel · Python · pandas · seaborn · scikit-learn
          </dd>
        </div>
      </dl>

      <div className="mt-6 text-sm lg:mt-auto lg:pt-6">
        <a
          href="https://github.com/Mohak-HoWaN/My-Data-Analytics-Portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          GitHub
          <ArrowUpRight className="size-3.5 text-faint" strokeWidth={1.5} />
        </a>
      </div>
    </div>
  </article>
);

export default Trainity;
