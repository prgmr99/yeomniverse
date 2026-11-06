import { post as ads_txt_returns_200_but_is_ignored } from './posts/ads-txt-returns-200-but-is-ignored';
import { post as adsense_strict_csp_nextjs } from './posts/adsense-strict-csp-nextjs';
import { post as canonical_env_var_build_time_inlining } from './posts/canonical-env-var-build-time-inlining';
import { post as five_thousand_urls_fifty_indexed } from './posts/five-thousand-urls-fifty-indexed';
import { post as fixed_bottom_bar_hides_content } from './posts/fixed-bottom-bar-hides-content';
import { post as measuring_rendered_html_pitfalls } from './posts/measuring-rendered-html-pitfalls';
import { post as middleware_runs_before_static_files } from './posts/middleware-runs-before-static-files';
import { post as noindex_scope_query_param } from './posts/noindex-scope-query-param';
import { post as public_data_night_walk_safety } from './posts/public-data-night-walk-safety';
import { post as push_does_not_always_deploy } from './posts/push-does-not-always-deploy';
import { post as quiz_answers_never_leave_the_browser } from './posts/quiz-answers-never-leave-the-browser';
import { post as service_descriptions_vs_code } from './posts/service-descriptions-vs-code';
import { post as single_source_for_duplicated_facts } from './posts/single-source-for-duplicated-facts';
import { post as spa_routes_identical_html_canonical } from './posts/spa-routes-identical-html-canonical';
import { post as static_content_inside_react_root } from './posts/static-content-inside-react-root';
import { post as vercel_app_public_suffix_adsense } from './posts/vercel-app-public-suffix-adsense';
import type { Post } from './types';

export type { Post, WritingBlock, WritingSection } from './types';

/** 목록·사이트맵·상세 페이지가 모두 이 배열에서 파생된다. 추가는 여기만 하면 된다. */
export const POSTS: Post[] = [
  canonical_env_var_build_time_inlining,
  public_data_night_walk_safety,
  adsense_strict_csp_nextjs,
  vercel_app_public_suffix_adsense,
  ads_txt_returns_200_but_is_ignored,
  middleware_runs_before_static_files,
  spa_routes_identical_html_canonical,
  static_content_inside_react_root,
  noindex_scope_query_param,
  measuring_rendered_html_pitfalls,
  service_descriptions_vs_code,
  fixed_bottom_bar_hides_content,
  push_does_not_always_deploy,
  quiz_answers_never_leave_the_browser,
  five_thousand_urls_fifty_indexed,
  single_source_for_duplicated_facts,
];

export const POST_SLUGS = POSTS.map((post) => post.slug);

export function getPost(slug: string): Post | undefined {
  return POSTS.find((post) => post.slug === slug);
}
