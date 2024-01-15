import * as yup from 'yup';

export async function validateForm(
	form: Record<string, unknown>,
	schema: yup.ObjectSchema<yup.AnyObject>
) {
	try {
		await schema.validate(form, { abortEarly: false });
		return {};
	} catch (err) {
		if (err instanceof yup.ValidationError) {
			return err.inner.reduce((errors: Record<string, string>, err: yup.ValidationError) => {
				const path = err.path || '';
				return { ...errors, [path]: err.message };
			}, {});
		}
		throw err;
	}
}
