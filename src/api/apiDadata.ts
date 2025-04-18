import axios from 'axios';

import type { IDadataAddress, IDadataCompany, IDadataSuggestion } from '@/types';

const DADATA_API_URL_ADDRESS='https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
const DADATA_API_URL_COMPANY_RUS='https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party';
const DADATA_API_URL_COMPANY_BY='https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party_by';
const DADATA_API_URL_COMPANY_KZ='https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party_kz';

const dadataClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Token ${process.env.NEXT_PUBLIC_DADATA_API_KEY}`,
    'X-Secret': process.env.NEXT_PUBLIC_DADATA_SECRET_KEY,
  }
});

export const getDadataAddress = async (query: string): Promise<IDadataSuggestion<IDadataAddress>> => {
  const { data } = await dadataClient.post(
    DADATA_API_URL_ADDRESS,
    { query }
  );
  return data;
};

type CountryCode = 'RUS' | 'BY' | 'KZ';

const DADATA_COMPANY_URLS: Record<CountryCode, string> = {
  'RUS': DADATA_API_URL_COMPANY_RUS,
  'BY': DADATA_API_URL_COMPANY_BY,
  'KZ': DADATA_API_URL_COMPANY_KZ,
};

export const getDadataCompany = async (
  query: string, 
  country: CountryCode = 'RUS'
): Promise<IDadataSuggestion<IDadataCompany>> => {
  const { data } = await dadataClient.post(
    DADATA_COMPANY_URLS[country],
    { query }
  );
  return data;
};