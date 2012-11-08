import argparse
import json
import os
import shutil
import sys
import tempfile

def main(argv=None):
	parser = argparse.ArgumentParser()
	parser.add_argument('--packages', action='append', default=['all'])
	parser.add_argument('--externs', action='append', default=['externs/all.js'])
	parser.add_argument('--minify', action='store_true', default=False)
	parser.add_argument('--output', default='../build/lge.js')

	args = parser.parse_args()
	output = args.output
	
	print("building lakritzGameEngine to "+args.output+"\n\n")
	
	fd, path = tempfile.mkstemp()
	tmp = open(path, 'w')

	for package in args.packages:
		print("package "+package+":")
		with open('../src/' + package + '.json','r') as p: files = json.load(p)
		for filename in files:
			print("\t-\""+filename+"\"")
			with open('../src/'+filename,'r') as f: tmp.write(f.read());
			tmp.write('\n');

	tmp.close()

	if args.minify is False:
			print("copying")
			shutil.copy(path,output)
			os.chmod(output, 0o664)
	
	else:
		print("minifiing")
		externs = "--externs ".join(args.externs)
		os.system('java -jar compiler/compiler.jar --warning_level=VERBOSE --jscomp_off=globalThis --externs %s --jscomp_off=checkTypes --language_in=ECMASCRIPT5_STRICT --js %s --js_output_file %s' % (externs, path, output))
	
	os.close(fd)
	os.remove(path)

	print("great success!")

if __name__ == "__main__":
	main()